# API architecture

The API codebase is split by data domain. Currently this means we have
`questions`, `answers`, and a dumping ground for common tools `utils`.

Each directory contains all of the code relating to that domain, so each
directory contains all of the code, from front to back relating to a particular
type of data.

Within each domain's directory, there will typically be four key components:

- Some `procedures`, an ordered list of high-level operations to be performed in
  order to complete a request
- A `repository` containing all of the database logic required to fetch, update,
  delete items from the Redis DB
- Some `types` describing the constraints on what data structures for that
  domain should look like.
- Some `routes` which contain the URL paths through which different `procedures`
  are accessed. The relationships between a URL and its appropriate `procedure`s
  are defined in `/api/routes.ts`. See the note below.

# The difference between a `url` and a `route`, and why

Procedures aren't specified on a per-URL basis because strictly, a URL specifies
a _resource_, not an action to be done on the resource. Different procedures
will be called when accessed by different HTTP methods. For example, the URL for
a `phrasing` will likely end up with several `procedures` attached to it, one
for each of the core actions of creating, reading, updating, and deleting.

# Execution order

## Routing

The first thing that happens when a request comes into the API's router is it
hits the `router` function in `/api/router.ts`. The router tries to find a
`route` (as defined in `/api/routes.ts`) that matches the request, based on the
request pathname and HTTP method. The `/api/routes.ts` file is in turn importing
lists of routes from all of the data domains, gathering them up and acting as an
aggregator.

If a valid route is found, the router extracts data from the HTTP request and
passes it through to the route's configured procedure. Whatever the procedure
returns is serialised into JSON, and sent back to the client.

The router also contains some basic error handling, so a procedure can simply
'throw' some common error types, and the router will behave appropriately.

## Procedures

These procedures will be found in a `procedures.ts` script, and are responsible
for these tasks, typically in this order:

1. Authenticating the user if necessary to ensure they are permitted to do
   whatever they're trying to do
2. Any other business logic if necessary, perhaps requesting data from a
   `repository` or talking to a third party API
3. Building a JSON-compatible (but not serialised!) return value for the router
   to send to the client

## Repositories

Typically, most `procedure`s will be expected to do some kind of database
operation, such as reading some data out or inserting new data. These operations
are strictly confined to `repository` files, whose various exported functions
must adhere to two conditions:

1. They must demand as little data as possible, avoiding large class instances
   being passed around as parameters . This discourages a common antipattern in
   application development where code "far away" from the HTTP handler is
   expected to speak HTTP (yes, it happens!).
2. They must return simple data wherever possible. This is for the same reason
   as above, as we don't want the database layer to be sending HTTP responses
3. They must implement restrictions relating to the data structures themselves.
   While the type system and constraints we use are fairly good at preventing us
   from attempting to save invalid data to the database, it can only do so much.
   - As an example, the repository's `create` function must ensure that the data
     it's given is a valid entry (no missing required fields, no conflicting
     data if appropriate, etc) and must create all appropriate index entries for
     the new data.
   - As a second example, a repository's `delete` handler must remove the item
     from any indexes etc
4. They must not implement any restrictions relating to anything except the data
   itself. While the database must ensure that whatever data it's given is
   technically valid, all responsibility for checks like "is this client allowed
   to perform this operation?" and such are strictly to be handled by the
   `procedure`. This prevents the `repository` from becoming cluttered with code
   relating to permissions checks etc, which is important as the database-
   specific code such as keeping indexes up to date and checking integrity are
   complex enough on their own without higher level business logic polluting
   them.

These behavioural constraints on `repository`s help ensure that when one
`repository` needs another `repository` to do some work, it can do so easily.
For example, when the `phrasing repository` is asked to update a `phrasing`'s
`answerID`, it must check that the answer exists, as a phrasing assigned to an
answer that doesn't exist would be invalid data. To do this, it should be able
to easily call some function in the `answer repository` with just a `answer` ID
to check validity, before committing the new `answerID` to the `phrasing` in the
database.
