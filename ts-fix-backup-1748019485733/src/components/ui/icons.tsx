import { LucideIcon, X, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Menu, Search, Bell, User, Settings, LogOut, Home, Users, Calendar, DollarSign, TrendingUp, Activity, MapPin, Bed, Maximize, Plus, CheckCircle, Clock, Zap, Filter, Download, Upload, Edit, Trash, Star, Phone, Mail, MessageSquare, Tag, Eye, EyeOff, Save, Copy, Clipboard, Link, ExternalLink, Share2, Heart, AlertCircle, InfoIcon, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RefreshCw, RotateCw, Loader, MoreHorizontal, MoreVertical, Grid, List, BarChart, PieChart, TrendingDown, Package, ShoppingCart, CreditCard, Wallet, Receipt, FileText, File, Folder, FolderOpen, Image, Video, Mic, Headphones, Camera, Wifi, WifiOff, Battery, BatteryCharging, Bluetooth, Cast, Cloud, CloudOff, Database, HardDrive, Server, Cpu, Monitor, Smartphone, Tablet, Laptop, Watch, Keyboard, Mouse, Printer, Speaker, Volume, VolumeX, Volume1, Volume2, Play, Pause, Square, Circle, Triangle, Hexagon, Octagon, Star as StarIcon, Award, Gift, Coffee, Feather, Anchor, Aperture, Book, BookOpen, Bookmark, Briefcase, Building, Code, Command, Compass, Flag, Globe, Hash, Layers, Layout, LifeBuoy, Map, Navigation, Paperclip, Percent, Power, Repeat, Scissors, Send, Shield, ShoppingBag, Shuffle, Sidebar, Sliders, Sun, Sunset, Target, Terminal, Thermometer, Trash2, Umbrella, Unlock, UserCheck, UserMinus, UserPlus, UserX, Wind, Zap as ZapIcon, type LucideProps } from 'lucide-react';
import { cn } from '@/lib/utils';

export type Icon = LucideIcon;

export const Icons = {
  // Close/Cancel
  X,
  Close: X,

  // Navigation
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Menu,

  // Search
  Search,

  // Notifications
  Bell,

  // User
  User,
  UserCheck,
  UserMinus,
  UserPlus,
  UserX,

  // Settings
  Settings,

  // Auth
  LogOut,

  // Pages
  Home,

  // Teams
  Users,

  // Calendar
  Calendar,

  // Money
  DollarSign,
  CreditCard,
  Wallet,
  Receipt,

  // Analytics
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart,
  PieChart,

  // Location
  MapPin,
  Map,
  Navigation,

  // Property
  Bed,
  Home: Home,
  Building,

  // UI
  Maximize,
  Plus,
  CheckCircle,
  Clock,
  Zap,
  ZapIcon,
  Filter,
  Download,
  Upload,
  Edit,
  Trash,
  Trash2,
  Star,
  StarIcon,

  // Communication
  Phone,
  Mail,
  MessageSquare,

  // Organization
  Tag,

  // Visibility
  Eye,
  EyeOff,

  // Actions
  Save,
  Copy,
  Clipboard,
  Link,
  ExternalLink,
  Share2,

  // Social
  Heart,

  // Alerts
  AlertCircle,
  InfoIcon,

  // Arrows
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,

  // Refresh
  RefreshCw,
  RotateCw,

  // Loading
  Loader,

  // More
  MoreHorizontal,
  MoreVertical,

  // Views
  Grid,
  List,

  // Commerce
  Package,
  ShoppingCart,
  ShoppingBag,

  // Files
  FileText,
  File,
  Folder,
  FolderOpen,

  // Media
  Image,
  Video,
  Mic,
  Headphones,
  Camera,

  // Connectivity
  Wifi,
  WifiOff,
  Bluetooth,
  Cast,

  // Cloud
  Cloud,
  CloudOff,

  // System
  Database,
  HardDrive,
  Server,
  Cpu,

  // Devices
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Watch,
  Keyboard,
  Mouse,
  Printer,
  Search,
  Speaker,

  // Audio
  Volume,
  VolumeX,
  Volume1,
  Volume2,

  // Media Controls
  Play,
  Pause,
  Square,

  // Shapes
  Circle,
  Triangle,
  Hexagon,
  Octagon,

  // Achievement
  Award,
  Gift,

  // Misc
  Coffee,
  Feather,
  Anchor,
  Aperture,
  Book,
  BookOpen,
  Bookmark,
  Briefcase,
  Code,
  Command,
  Compass,
  Flag,
  Globe,
  Hash,
  Layers,
  Layout,
  LifeBuoy,
  Paperclip,
  Percent,
  Power,
  Repeat,
  Scissors,
  Send,
  Shield,
  Shuffle,
  Sidebar,
  Sliders,
  Sun,
  Sunset,
  Target,
  Terminal,
  Thermometer,
  Settings,
  Umbrella,
  Unlock,
  Wind,
  
  // Custom spinner component
  spinner: ({ className, ...props }: LucideProps) => (
    <Loader className={cn("animate-spin", className)} {...props} />
  ),
  
  // OAuth provider icons (using custom SVGs)
  google: ({ className, ...props }: LucideProps) => (
    <svg className={className} viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="currentColor"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="currentColor"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="currentColor"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  ),
  
  microsoft: ({ className, ...props }: LucideProps) => (
    <svg className={className} viewBox="0 0 24 24" {...props}>
      <path fill="#f25022" d="M1 1h10v10H1z" />
      <path fill="#7fba00" d="M13 1h10v10H13z" />
      <path fill="#00a4ef" d="M1 13h10v10H1z" />
      <path fill="#ffb900" d="M13 13h10v10H13z" />
    </svg>
  )
};