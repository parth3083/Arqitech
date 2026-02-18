# ArqiTech

ArqiTech is an AI-first design environment tailored for architects and designers. It enables users to visualize, render, and orchestrate architectural projects directly from their browser with the speed of thought. By simply uploading a floor plan, users can generate immersive visualizations and manage their design portfolio seamlessly.

## Features

- **AI-Powered Visualization**: Transform 2D floor plans into stunning renderings instantly.
- **Rapid Prototyping**: Visualize, render, and ship architectural projects faster than ever.
- **Drag & Drop Upload**: Support for JPG and PNG floor plan uploads (up to 10MB).
- **Project Structure**: Organized project management with private visibility options.
- **Cloud-Native Architecture**: Built on Puter.js for secure authentication, storage, and hosting.
- **Modern UI**: A responsive, accessible interface built with Tailwind CSS and Radix UI primitives.

## Technology Stack

ArqiTech is built using a modern, scalable web stack:

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [React 19](https://react.dev/), [Lucide React](https://lucide.dev/), `@repo/ui` (internal design system)
- **Backend & Auth**: [Puter.js](https://puter.com/) (`@heyputer/puter.js`)
- **Monorepo Tooling**: [TurboRepo](https://turbo.build/)

## Project Structure

This project is organized as a monorepo:

- `apps/web`: The main web application.
- `packages/ui`: Shared React component library.
- `packages/eslint-config`: Shared ESLint configuration.
- `packages/typescript-config`: Shared TypeScript configuration.

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (Version 18 or higher)
- [pnpm](https://pnpm.io/) (Recommended package manager)

### Setup

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd arqitech
    ```

2.  **Install dependencies:**

    This project uses `pnpm` workspaces. Install all dependencies from the root directory:

    ```bash
    pnpm install
    ```

## Usage

### Development

To start the development server for all applications:

```bash
pnpm dev
# or
turbo dev
```

The web application will be available at [http://localhost:3000](http://localhost:3000).

To run only the web application:

```bash
pnpm --filter web dev
```

### Building

To build all apps and packages:

```bash
pnpm build
# or
turbo build
```

To build a specific application (e.g., `web`):

```bash
pnpm --filter web build
```

### Linting & Formatting

To run the linter and check for code quality issues:

```bash
pnpm lint
```

To format code using Prettier:

```bash
pnpm format
```

## Contributing

We welcome contributions to ArqiTech! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix (`git checkout -b feature/amazing-feature`).
3.  Commit your changes (`git commit -m 'Add some amazing feature'`).
4.  Push to your branch (`git push origin feature/amazing-feature`).
5.  Open a Pull Request.

Please ensure your code adheres to the project's coding standards and passes all linting checks before submitting.

## License

This project is private and proprietary. All rights reserved.
