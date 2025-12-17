# X-SuperBacon-Chopper

Web application for checking Twitter/X shadowban status

## Project Overview

React-based web application for checking Twitter/X account shadowban status.

## Tech Stack

- **Framework**: React 18.3 + TypeScript
- **Build Tool**: Vite 6.0
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI based)
- **Routing**: React Router DOM
- **Ads**: Google AdSense, DMM Affiliate

## Project Structure

```
/
├── src/
│   ├── components/
│   │   ├── ShadowbanChecker.tsx       # Main shadowban checker
│   │   ├── TwitterStatusChecker.tsx    # Twitter status checker
│   │   ├── TwitterStatusHistory.tsx    # History display
│   │   ├── results/                    # Check result display components
│   │   ├── adsense/                    # Ad-related components
│   │   ├── alert/                      # Notification/alert components
│   │   ├── seo/                        # SEO-related components
│   │   ├── ui/                         # shadcn/ui UI components
│   │   └── util/                       # Utilities
│   ├── services/
│   │   └── api.ts                      # API client
│   ├── lib/                            # Utility libraries
│   ├── App.tsx                         # Application root
│   └── main.tsx                        # Entry point
├── public/                             # Static files
└── announcements/                      # Announcements

```

## Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Production build
- `npm run build:dev` - Development mode build
- `npm run build:staging` - Staging environment build
- `npm run publish` - Production environment build
- `npm run lint` - Run ESLint
- `npm run preview` - Preview built application

## Key Features

1. **Shadowban Check**: Check Twitter/X account shadowban status
2. **Status History**: Display past check results
3. **Encryption**: Client-side encryption processing
4. **SEO Optimization**: Meta tag management with React Helmet

## Coding Guidelines

- Use TypeScript strict mode
- Follow ESLint configuration
- Prefer shadcn/ui components
- Style with Tailwind CSS
- Organize components by feature in directories
- Write code comments focusing on "why" (rationale) not "what" (implementation)

## Git Workflow Rules

### Commit and Push Policy
- **NEVER commit or push without explicit user approval**
- Always present changes and commit message together in a single response
- Wait for user confirmation before executing git commands
- Workflow:
  1. Show code changes AND proposed commit message together
  2. Wait for user's "OK" or approval
  3. Only then execute git add, commit, and push

### Commit Message Format
- **Write commit messages in Japanese**
- Follow Conventional Commits format (feat:, fix:, docs:, etc.)

### When to Commit
- Only when user explicitly requests it
- After user reviews and approves the changes
- Never assume user wants immediate commit

## Build Configuration

Supports multiple build modes:
- **development**: For development environment
- **staging**: For staging environment
- **production**: For production environment

Includes JavaScript obfuscation and code optimization.

## Important Notes

- API calls require proper error handling
- Handle personal information with care
