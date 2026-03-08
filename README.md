# Personal Website

A minimal, modern personal website built with vanilla HTML, CSS, and JavaScript. Uses Decap CMS for content management with DecapBridge PKCE authentication.

## Features

- **Minimal Design** - Clean, uncluttered layout with ample white space
- **Left-side Navigation** - Fixed sidebar with hamburger menu on mobile
- **Learning Journey** - Track courses and workshops with certificate support
- **Decap CMS** - Easy content management via admin panel
- **DecapBridge PKCE** - Secure authentication

## Sections

1. **Home** - Brief introduction about yourself
2. **Socials** - Links to GitHub, LinkedIn, Twitter, etc.
3. **Contact** - Contact form and information
4. **Learning Journey** - Courses and Workshops with optional certificates
5. **Admin** - Content management panel at `/admin`

## Quick Start

1. Clone the repository
2. Deploy to GitHub Pages:
   - Settings > Pages > Deploy from branch > main/(root)
3. The site will be available at `https://your-username.github.io/repo-name/`

## CMS Access

The admin panel is at: `/admin/index.html`

Example: `https://rubenmgoncalves.github.io/curly-garbanzo/admin/index.html`

## Content Structure

```
content/
├── home/intro.md      # Homepage intro
├── socials/index.md   # Social links
├── contact/index.md  # Contact info
├── courses/          # Course entries
└── workshops/        # Workshop entries
```

## Adding Content

1. Go to `/admin` (e.g., `https://rubenmgoncalves.github.io/curly-garbanzo/admin/index.html`)
2. Log in with your DecapBridge account
3. Add/edit content:
   - **Home**: Edit name and bio
   - **Socials**: Add platform links
   - **Contact**: Update email/phone
   - **Courses**: Add courses with title, description, dates, certificate
   - **Workshops**: Add workshops with title, description, date, certificate

## Customization

- Edit `content/home/intro.md` to change the homepage intro
- Edit `content/socials/index.md` to update social links
- Edit `content/contact/index.md` to update contact info

## Tech Stack

- HTML5
- CSS3 (custom properties, flexbox, grid)
- JavaScript (vanilla)
- Decap CMS
- DecapBridge PKCE (authentication)
