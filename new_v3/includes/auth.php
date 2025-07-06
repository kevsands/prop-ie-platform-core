<?php
/**
 * PropIE Platform v3 - Authentication System
 * Simple yet secure authentication for PHP applications
 */

session_start();
require_once __DIR__ . '/../config/database.php';

class Auth {
    private $db;
    
    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }
    
    /**
     * Register a new user
     */
    public function register($email, $password, $firstName, $lastName, $phone = null, $role = 'BUYER') {
        try {
            // Check if user already exists
            if ($this->userExists($email)) {
                return ['success' => false, 'message' => 'Email already registered'];
            }
            
            // Validate input
            if (!$this->isValidEmail($email)) {
                return ['success' => false, 'message' => 'Invalid email format'];
            }
            
            if (strlen($password) < 6) {
                return ['success' => false, 'message' => 'Password must be at least 6 characters'];
            }
            
            // Generate UUID and hash password
            $userId = generateUuid();
            $passwordHash = password_hash($password, PASSWORD_DEFAULT);
            
            // Begin transaction
            $this->db->beginTransaction();
            
            // Insert user
            $stmt = $this->db->prepare("
                INSERT INTO users (id, email, password_hash, first_name, last_name, phone, status, created_at)
                VALUES (?, ?, ?, ?, ?, ?, 'ACTIVE', NOW())
            ");
            
            $stmt->execute([$userId, $email, $passwordHash, $firstName, $lastName, $phone]);
            
            // Add user role
            $roleId = generateUuid();
            $roleStmt = $this->db->prepare("
                INSERT INTO user_roles (id, user_id, role, assigned_at)
                VALUES (?, ?, ?, NOW())
            ");
            
            $roleStmt->execute([$roleId, $userId, $role]);
            
            // Commit transaction
            $this->db->commit();
            
            return ['success' => true, 'message' => 'Registration successful', 'user_id' => $userId];
            
        } catch (Exception $e) {
            $this->db->rollback();
            error_log("Registration error: " . $e->getMessage());
            return ['success' => false, 'message' => 'Registration failed'];
        }
    }
    
    /**
     * Login user
     */
    public function login($email, $password, $rememberMe = false) {
        try {
            $user = $this->getUserByEmail($email);
            
            if (!$user) {
                return ['success' => false, 'message' => 'Invalid email or password'];
            }
            
            if (!password_verify($password, $user['password_hash'])) {
                return ['success' => false, 'message' => 'Invalid email or password'];
            }
            
            if ($user['status'] !== 'ACTIVE') {
                return ['success' => false, 'message' => 'Account is not active'];
            }
            
            // Update last login
            $this->updateLastLogin($user['id']);
            
            // Set session
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_email'] = $user['email'];
            $_SESSION['user_name'] = $user['first_name'] . ' ' . $user['last_name'];
            $_SESSION['logged_in'] = true;
            $_SESSION['login_time'] = time();
            
            // Set remember me cookie
            if ($rememberMe) {
                $token = bin2hex(random_bytes(32));
                setcookie('remember_token', $token, time() + (30 * 24 * 60 * 60), '/', '', false, true);
                $this->setRememberToken($user['id'], $token);
            }
            
            return ['success' => true, 'message' => 'Login successful', 'user' => $this->formatUserData($user)];
            
        } catch (Exception $e) {
            error_log("Login error: " . $e->getMessage());
            return ['success' => false, 'message' => 'Login failed'];
        }
    }
    
    /**
     * Logout user
     */
    public function logout() {
        // Clear remember token
        if (isset($_COOKIE['remember_token'])) {
            $this->clearRememberToken($_SESSION['user_id'] ?? '');
            setcookie('remember_token', '', time() - 3600, '/');
        }
        
        // Clear session
        $_SESSION = [];
        session_destroy();
        
        return ['success' => true, 'message' => 'Logged out successfully'];
    }
    
    /**
     * Check if user is logged in
     */
    public function isLoggedIn() {
        if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true) {
            return true;
        }
        
        // Check remember me token
        if (isset($_COOKIE['remember_token'])) {
            return $this->validateRememberToken($_COOKIE['remember_token']);
        }
        
        return false;
    }
    
    /**
     * Get current user
     */
    public function getCurrentUser() {
        if (!$this->isLoggedIn()) {
            return null;
        }
        
        $userId = $_SESSION['user_id'] ?? null;
        if (!$userId) {
            return null;
        }
        
        return $this->getUserById($userId);
    }
    
    /**
     * Get user roles
     */
    public function getUserRoles($userId) {
        $stmt = $this->db->prepare("SELECT role FROM user_roles WHERE user_id = ?");
        $stmt->execute([$userId]);
        return $stmt->fetchAll(PDO::FETCH_COLUMN);
    }
    
    /**
     * Check if user has role
     */
    public function hasRole($role, $userId = null) {
        if (!$userId) {
            $user = $this->getCurrentUser();
            $userId = $user['id'] ?? null;
        }
        
        if (!$userId) {
            return false;
        }
        
        $roles = $this->getUserRoles($userId);
        return in_array($role, $roles);
    }
    
    /**
     * Require authentication
     */
    public function requireAuth($redirectTo = '/pages/login.php') {
        if (!$this->isLoggedIn()) {
            header("Location: $redirectTo");
            exit;
        }
    }
    
    /**
     * Require specific role
     */
    public function requireRole($role, $redirectTo = '/') {
        $this->requireAuth();
        
        if (!$this->hasRole($role)) {
            header("Location: $redirectTo");
            exit;
        }
    }
    
    /**
     * Change password
     */
    public function changePassword($userId, $currentPassword, $newPassword) {
        try {
            $user = $this->getUserById($userId);
            
            if (!$user || !password_verify($currentPassword, $user['password_hash'])) {
                return ['success' => false, 'message' => 'Current password is incorrect'];
            }
            
            if (strlen($newPassword) < 6) {
                return ['success' => false, 'message' => 'New password must be at least 6 characters'];
            }
            
            $newPasswordHash = password_hash($newPassword, PASSWORD_DEFAULT);
            
            $stmt = $this->db->prepare("UPDATE users SET password_hash = ?, updated_at = NOW() WHERE id = ?");
            $stmt->execute([$newPasswordHash, $userId]);
            
            return ['success' => true, 'message' => 'Password changed successfully'];
            
        } catch (Exception $e) {
            error_log("Password change error: " . $e->getMessage());
            return ['success' => false, 'message' => 'Password change failed'];
        }
    }
    
    /**
     * Reset password (simplified - in production use proper email verification)
     */
    public function resetPassword($email) {
        try {
            $user = $this->getUserByEmail($email);
            
            if (!$user) {
                // Don't reveal if email exists
                return ['success' => true, 'message' => 'If email exists, reset instructions have been sent'];
            }
            
            // Generate temporary password
            $tempPassword = bin2hex(random_bytes(8));
            $passwordHash = password_hash($tempPassword, PASSWORD_DEFAULT);
            
            $stmt = $this->db->prepare("UPDATE users SET password_hash = ?, updated_at = NOW() WHERE id = ?");
            $stmt->execute([$passwordHash, $user['id']]);
            
            // In production, send email with temporary password
            error_log("Temporary password for {$email}: {$tempPassword}");
            
            return ['success' => true, 'message' => 'Password reset instructions sent to your email'];
            
        } catch (Exception $e) {
            error_log("Password reset error: " . $e->getMessage());
            return ['success' => false, 'message' => 'Password reset failed'];
        }
    }
    
    // Private helper methods
    
    private function userExists($email) {
        $stmt = $this->db->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        return $stmt->fetch() !== false;
    }
    
    private function getUserByEmail($email) {
        $stmt = $this->db->prepare("
            SELECT u.*, l.city, l.county 
            FROM users u 
            LEFT JOIN locations l ON u.location_id = l.id 
            WHERE u.email = ?
        ");
        $stmt->execute([$email]);
        return $stmt->fetch();
    }
    
    private function getUserById($id) {
        $stmt = $this->db->prepare("
            SELECT u.*, l.city, l.county,
                   GROUP_CONCAT(ur.role) as roles
            FROM users u 
            LEFT JOIN locations l ON u.location_id = l.id 
            LEFT JOIN user_roles ur ON u.id = ur.user_id
            WHERE u.id = ?
            GROUP BY u.id
        ");
        $stmt->execute([$id]);
        $user = $stmt->fetch();
        
        if ($user && $user['roles']) {
            $user['roles'] = explode(',', $user['roles']);
        } else {
            $user['roles'] = [];
        }
        
        return $user;
    }
    
    private function updateLastLogin($userId) {
        $stmt = $this->db->prepare("UPDATE users SET last_login = NOW(), last_active = NOW() WHERE id = ?");
        $stmt->execute([$userId]);
    }
    
    private function setRememberToken($userId, $token) {
        $tokenHash = hash('sha256', $token);
        $stmt = $this->db->prepare("UPDATE users SET remember_token = ? WHERE id = ?");
        $stmt->execute([$tokenHash, $userId]);
    }
    
    private function clearRememberToken($userId) {
        $stmt = $this->db->prepare("UPDATE users SET remember_token = NULL WHERE id = ?");
        $stmt->execute([$userId]);
    }
    
    private function validateRememberToken($token) {
        $tokenHash = hash('sha256', $token);
        $stmt = $this->db->prepare("SELECT id, email, first_name, last_name FROM users WHERE remember_token = ? AND status = 'ACTIVE'");
        $stmt->execute([$tokenHash]);
        $user = $stmt->fetch();
        
        if ($user) {
            // Set session
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_email'] = $user['email'];
            $_SESSION['user_name'] = $user['first_name'] . ' ' . $user['last_name'];
            $_SESSION['logged_in'] = true;
            $_SESSION['login_time'] = time();
            
            $this->updateLastLogin($user['id']);
            return true;
        }
        
        return false;
    }
    
    private function formatUserData($user) {
        return [
            'id' => $user['id'],
            'email' => $user['email'],
            'first_name' => $user['first_name'],
            'last_name' => $user['last_name'],
            'full_name' => $user['first_name'] . ' ' . $user['last_name'],
            'phone' => $user['phone'],
            'avatar_url' => $user['avatar_url'],
            'status' => $user['status'],
            'kyc_status' => $user['kyc_status'],
            'organization' => $user['organization'],
            'position' => $user['position'],
            'location' => $user['city'] ? $user['city'] . ', ' . $user['county'] : null,
            'roles' => $this->getUserRoles($user['id'])
        ];
    }
    
    private function isValidEmail($email) {
        return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
    }
}

// Global auth instance
$auth = new Auth();

// Helper functions
function auth() {
    global $auth;
    return $auth;
}

function user() {
    return auth()->getCurrentUser();
}

function isLoggedIn() {
    return auth()->isLoggedIn();
}

function hasRole($role) {
    return auth()->hasRole($role);
}

function requireAuth($redirectTo = '/pages/login.php') {
    auth()->requireAuth($redirectTo);
}

function requireRole($role, $redirectTo = '/') {
    auth()->requireRole($role, $redirectTo);
}
?>