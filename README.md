# LSERSA website

2023 re-build of the LSERSA website using [Gatsby](https://www.gatsbyjs.com/),
[PlanetScale](https://planetscale.com/) and [Netlify](https://www.netlify.com/).

## Rationale

Using Gatsby allows for a data-driven approach to generating the site (particualrly  for the
`/races/` and `/minutes/` elements, which otherwise are proven to be quite intensive to maintain)
and also provides React and lambda functions to run the booking system.

## Deployment

At point of writing the re-build is still in progress, but intention is that the replacement site
will be deployed onto Netlify (using GitHub integration) and the appropriate records changed so that
`lsersa.org` automatically (and invisible) forwards.

*This is the approach taken for the Bowles website re-build from 2016, which worked well*

## Database

The backend for the booking system is a MySQL database on PlanetScale, accessed by API routes on
the website (provided as Gatsby functions). The database structure is:

![database schema diagram](./_db_info/LSERSA%20booking%20schema.png)






### TO DO

- [x] footer not fixed to bottom on smaller pages
- [x] gatsby build setting for netlify
- [x] social icons touching bottom edge of screen, need padding
- [x] check how menu looks on both phones and ipad (some weirdness going on?)
- [x] fix masonry on the sponsors page (npm package?)
- [x] race pages => automate archive
- [x] race pages => automate current year
- [x] race pages => copy from 11ty version
- [x] race pages => add timing on day
- [x] race pages => add link to policy (update policy?)
- [x] race pages => add further years and documents as necessary
- [x] school race pages + results
- [x] CN and tri-regional results, check/add
- [x] training page => set it up
- [ ] training page => any info on other training? Telemark, Skiercross?
- [x] region page => committee
- [ ] not sure where, but minutes etc
- [x] clubs page
- [x] add blurb and links for clubs
- [ ] do we also want to put in slopes?
- [x] add favicon
- [x] sponsor carousel
- [ ] link "highlight hover" doesn't work if the link is over multiple rows