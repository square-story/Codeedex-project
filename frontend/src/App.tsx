

function App() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Codeedex Frontend
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          Initialized with React, TypeScript, Vite, Tailwind CSS, and shadcn/ui.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <button className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
            Get started
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
