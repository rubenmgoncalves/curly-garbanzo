# Personal Website

A minimal, modern personal website built with vanilla HTML, CSS, and JavaScript. Uses Decap CMS for content management and DecapBridge for authentication.

## Features

- **Minimal Design** - Clean, uncluttered layout with ample white space
- **Left-side Navigation** - Fixed sidebar with hamburger menu on mobile
- **Learning Journey** - Track courses and workshops with certificate support
- **Decap CMS** - Easy content management via admin panel
- **DecapBridge** - Free authentication without Netlify Identity

## Sections

1. **Home** - Brief introduction about yourself
2. **Socials** - Links to GitHub, LinkedIn, Twitter, etc.
3. **Contact** - Contact form and information
4. **Learning Journey** - Courses and Workshops with optional certificates
5. **Admin** - Content management panel

## Quick Start

1. Clone the repository
2. Deploy to any static hosting (Netlify, Vercel, GitHub Pages)
3. Set up DecapBridge for authentication

## DecapBridge Setup

1. Sign up at [decapbridge.com](https://decapbridge.com)
2. Add your site with GitHub repository
3. Update `admin/config.yml` with your DecapBridge URL

## Content Structure

```
content/
├── home/intro.md      # Homepage intro
├── socials/index.md   # Social links
├── contact/index.md  # Contact info
├── courses/          # Course entries
└── workshops/        # Workshop entries
```

## Customization

- Edit `content/home/intro.md` to change the homepage intro
- Edit `content/socials/index.md` to update social links
- Edit `content/contact/index.md` to update contact info
- Add courses via the admin panel at `/admin`

## Tech Stack

- HTML5
- CSS3 (custom properties, flexbox, grid)
- JavaScript (vanilla)
- Decap CMS
- DecapBridge (authentication)
