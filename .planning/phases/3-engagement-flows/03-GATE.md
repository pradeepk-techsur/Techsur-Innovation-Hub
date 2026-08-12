
## Backend pre-push gate

- Status: passed
- Result marker + failing output tail:
```
__GATE__ build_exit=0 test_exit=-1 build_cmd=[npm run build] test_cmd=[none]
   Generating static pages (0/19) ...
   Generating static pages (4/19) 
   Generating static pages (9/19) 
   Generating static pages (14/19) 
 ✓ Generating static pages (19/19)
   Finalizing page optimization ...
   Collecting build traces ...

Route (app)                                 Size  First Load JS
┌ ○ /                                      156 B         103 kB
├ ○ /_not-found                            996 B         104 kB
├ ƒ /api/auth/login                        156 B         103 kB
├ ƒ /api/auth/logout                       156 B         103 kB
├ ƒ /api/auth/session                      156 B         103 kB
├ ƒ /api/v1/catalog                        156 B         103 kB
├ ƒ /api/v1/engagement                     156 B         103 kB
├ ƒ /api/v1/records/[slug]                 156 B         103 kB
├ ƒ /api/v1/search                         156 B         103 kB
├ ƒ /api/v1/search/facets                  156 B         103 kB
├ ƒ /api/v1/submissions/contribution       156 B         103 kB
├ ƒ /api/v1/submissions/opportunity        156 B         103 kB
├ ƒ /catalog                               162 B         106 kB
├ ƒ /login                                 696 B         103 kB
├ ƒ /records/[slug]                      4.83 kB         107 kB
├ ƒ /search                              2.14 kB         108 kB
├ ƒ /submit-contribution                 3.29 kB         106 kB
├ ƒ /submit-contribution/confirmation      156 B         103 kB
├ ƒ /submit-opportunity                  2.52 kB         105 kB
└ ƒ /submit-opportunity/confirmation       156 B         103 kB
+ First Load JS shared by all             103 kB
  ├ chunks/255-87552e6e05b8e3aa.js       46.4 kB
  ├ chunks/4bd1b696-c023c6e3521b1417.js  54.2 kB
  └ other shared chunks (total)          1.91 kB


ƒ Middleware                             39.5 kB

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand

```

## Backend pre-push gate

- Status: passed
- Result marker + failing output tail:
```
__GATE__ build_exit=0 test_exit=-1 build_cmd=[npm run build] test_cmd=[none]
   Generating static pages (0/19) ...
   Generating static pages (4/19) 
   Generating static pages (9/19) 
   Generating static pages (14/19) 
 ✓ Generating static pages (19/19)
   Finalizing page optimization ...
   Collecting build traces ...

Route (app)                                 Size  First Load JS
┌ ○ /                                      156 B         103 kB
├ ○ /_not-found                            996 B         104 kB
├ ƒ /api/auth/login                        156 B         103 kB
├ ƒ /api/auth/logout                       156 B         103 kB
├ ƒ /api/auth/session                      156 B         103 kB
├ ƒ /api/v1/catalog                        156 B         103 kB
├ ƒ /api/v1/engagement                     156 B         103 kB
├ ƒ /api/v1/records/[slug]                 156 B         103 kB
├ ƒ /api/v1/search                         156 B         103 kB
├ ƒ /api/v1/search/facets                  156 B         103 kB
├ ƒ /api/v1/submissions/contribution       156 B         103 kB
├ ƒ /api/v1/submissions/opportunity        156 B         103 kB
├ ƒ /catalog                               162 B         106 kB
├ ƒ /login                                 696 B         103 kB
├ ƒ /records/[slug]                      4.83 kB         107 kB
├ ƒ /search                              2.14 kB         108 kB
├ ƒ /submit-contribution                 3.29 kB         106 kB
├ ƒ /submit-contribution/confirmation      156 B         103 kB
├ ƒ /submit-opportunity                  2.52 kB         105 kB
└ ƒ /submit-opportunity/confirmation       156 B         103 kB
+ First Load JS shared by all             103 kB
  ├ chunks/255-87552e6e05b8e3aa.js       46.4 kB
  ├ chunks/4bd1b696-c023c6e3521b1417.js  54.2 kB
  └ other shared chunks (total)          1.91 kB


ƒ Middleware                             39.5 kB

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand

```
