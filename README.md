# Overview

This repository is a single-binary program, combining both a static HTTP file
server containing an administrative control panel currently called StampyAdmin,
and a backend API process called StampyCore, which will be used to actually
power StampyAdmin as well as all other Stampyverse services like Stampy the
Discord bot, Stampy UI, and more.

# Why are StampyCore and StampyAdmin in one repository?

Because it was easier for me at the time of starting the project, and it has a
few fairly low-cost tradeoffs that buy us what I (Chris R) think are useful
improvements:

- Tightly coupling the API provider and a reference example of an API consumer
  to each other ensures Stampy Admin always works as a good reference
  implementation of a Stampyverse API consumer
- Both applications being in one _directory_ makes it trivial to share
  Typescript type definitions between them, which makes maintenance of
  StampyAdmin easier as the compiler will naturally throw errors whenever
  StampyCore's type definitions change
- Both applications being in one _binary_ (of sorts) makes it easier for a
  developer to start working on Stampy with relatively little orchestration
  software on their computer (although very _waves hands_ magic things like
  Remix Run also achieve the same effect)

This comes with some downsides:

- The repository is a bit weird in places - the node modules necessary to power
  the compiler etc used to build the front end aren't at the top of the project
  as some developers are accustomed to and are instead buried down inside
  `/front/src/`
- Using Deno as a runtime for the API and HTTP server means a developer needs
  _both_ Node and Deno on their system, as Node is still sadly necessary for the
  front-end build tools. I feel this is justified by the extreme ease of
  deployment through Deno Deploy and by the general "niceness" of Deno as a
  runtime and toolkit

# How does the file structure work?

The codebase is split into three main sections:

- Code relating strictly to the API
- Code relating strictly to the HTTP file server which is referred to as the
  front end in this project
- Code that is used by both the API and front end

This naturally yields the directory structure we see here, with `api`, `front`,
and `shared` directories.

Both roles, the front end and the API, are served by a single Deno process which
binds a single HTTP server on a single port. Requests relating to the API and
the front are therefore all sent to a single top-level router module in
`index.ts` in the project root, which dispatches requests to either the
`backendRouter` or `frontendRouter` as appropriate depending on their URL.

All requests whose pathnames start with `/api` (eg
`https://core.stampy.ai/api/questions`) are routed to the API router, located in
`/api/index.ts` and ALL other requests regardless of pathname are sent to the
front end router in `/front/index.ts`, which will do further checks as detailed
below.

# How the front end works

The front end is a fairly conventional React app, although due to the fact it's
served by the same web server process as the API, the code structure is a little
counterintuitive in a couple of places around its edges. Inside the `front`
directory you will find a `src` and `dist` directory. `dist` ships with the HTML
file that a web browser will see to boot the application, as well as some static
assets as part of the repository for the sake of toolchain simplicity. These
files could be moved into the `src` directory and programmatically copied into
`dist` as part of the front end compilation process, but this would yield almost
no benefit in exchange for more complex tooling.

As mentioned above, the front end has its own router, which determines what
resources to send back to any given request from a HTTP client. Any request
whose pathname starts with `/front` is routed to the filesystem, where the
pathname is mapped to the `/front/dist` directory. So a request for
`https://core.stampy.ai/front/styles.css` will receive `/front/dist/styles.css`
as a response.

All other requests (effectively, all requests that don't start with `/front`)
receive the application bundle as a response, so a request to
`https://core.stampy.ai/questions` or anywhere else will be given the front end
HTML at `/front/dist/index.html`. The HTML template then loads the application
JS + CSS, which boots and checks the URL the user has entered in their address
bar, and then finally loads the relevant part of the UI.

# How the API works

All requests whose pathnames start with `/api` are routed to the API's router in
`/api/router.ts`. Due to the relatively complex (compared to the front end)
nature of API routing, this router contains quite a bit of business logic, which
is explained in the API's README.md at `/api/README.md`. As a general outline
though, the API is a (mostly) REST-compliant interface implementing basic CRUD
operations for all data types the system contains.

Further information on the API architecture can be found in the API's own
README.

# Running dev instance:

1. Compile the front end JS code with `deno task build-frontend`
2. Launch the server
   - With debugger: `deno task debug`
   - Or with auto-rebuild of the backend on file changes: `deno task watch`

Deno cannot run _both_ a filesystem watcher and a debugger at the same time, as
the file system watcher reboots the stack and would disconnect any attached
debugger from the server.

You can also run `deno task` to see a list of operations that we have define in
the project configuration.

# Building for deployment:

- Run the pre-commit hook, typically by making a commit

# Deploying:

## To production

- Put a new commit in trunk

## To preview

- run `deployctl` locally - this will require some administrative setup, for
  which you're best to just talk to Chris
