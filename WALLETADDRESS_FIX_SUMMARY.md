# WalletAddress Fix Summary

## Problem
The blockchain-related API routes were trying to access `session.user.walletAddress`, which doesn't exist on the NextAuth session user type.

## Solution
Updated all blockchain routes to use `session.user.id` instead of `session.user.walletAddress`. The blockchain service should map the user ID to a wallet address internally.

## Changes Made

### `/src/app/api/blockchain/dividends/route.ts`
- Updated `getUserHoldings` to use `session.user.id` instead of `session.user.walletAddress`
- Added comment explaining that walletAddress is not available on the session user object
- Updated authentication checks to verify `session.user?.id` exists

### `/src/app/api/blockchain/purchase/route.ts`
- Updated `purchaseShares` to use `session.user.id` as the buyer identifier
- Updated `userAddress` assignment to use `session.user.id`
- Updated authentication checks to verify `session.user?.id` exists

### `/src/app/api/blockchain/tokenize/route.ts`
- Updated `getUserHoldings` to use `session.user.id`
- Updated authentication checks to verify `session.user?.id` exists

## Implementation Notes
- The blockchain service should be responsible for mapping user IDs to wallet addresses
- All blockchain routes now consistently use user ID as the identifier
- Added comments to clarify this design decision