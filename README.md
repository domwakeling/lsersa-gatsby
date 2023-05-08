# LSERSA website

[![Netlify Status](https://api.netlify.com/api/v1/badges/658d902f-c687-4c02-9058-5be539a76000/deploy-status)](https://app.netlify.com/sites/lsersa/deploys)

2023 re-build of the LSERSA website using [Gatsby](https://www.gatsbyjs.com/),
[PlanetScale](https://planetscale.com/) and [Netlify](https://www.netlify.com/).

## Index
**[Rationale](#rationale)**

**[Deployment](#deployment)**

**[Sponsors](#sponsors)**

**[The Region](#the-region)**
* [Clubs](#clubs)
* [Slopes](#slopes)

**[Booking System](#booking-system)**
* [Database](#database)

## Rationale

Using Gatsby allows for a data-driven approach to generating the site (particualrly  for the
`/races/` and `/minutes/` elements, which otherwise are proven to be quite intensive to maintain)
and also provides React and lambda functions to run the booking system.

## Deployment

At point of writing the re-build is still in progress, but intention is that the replacement site
will be deployed onto Netlify (using GitHub integration) and the appropriate records changed so that
`lsersa.org` automatically (and invisible) forwards.

*This is the approach taken for the Bowles website re-build from 2016, which worked well*

[⥣ back to index](#index)

## Sponsors

Sponsor information is stored in the `sponsors.yaml` data file:

```
src
|- data
   |- sponsors.yaml
```

The structure for each sponsor is:

```yaml
-   name:   // sponsors name
    url:    // url for sponsor's website
    img:    // image in 400x300 ratio, in scr/images/sponsors *
    target: // recommend underscore and sponsor name, no spaces
    copy:   // sponsor copy in html formatting

* img path in the file should be sponsors/<sponsor_name>.png (or jepg)
```

This data is used (a) to populate the `sponsors` page, (b) to populate the sponsors carousel that
sits alongside "hero" images, and (c) to populate the sponsors images at the bottom of the homepage.

For the 2023 season there are seven sponsors and having seven logos in onw row (reducing to four
logos per row on smaller devices) appears to work well; this is determined by the styling
of the `.sponsor-logo-grid` element **in the `_homepage.scss` file** (change the
`grid-template-columns: repeat(7, 1fr);` value).

As new sponsors are added (and old removed), the following changes are required:
* change the content of the `sponsors.yaml` file (deleting and adding as appropriate)
* for new sponsors, a logo is required - this should sit in the `src/images/sponsors` 
  folder; have a transparent background (`png` recommended); be in a 4:3 ratio, ideally 400x300
* if the number of sponsors changes, change the `grid-template-columns` value in
  `src/style/_homepage.scss` (for `.sponsor-grid-logo`)
  
[⥣ back to index](#index)

## The Region

### Clubs

As with most other elements, clubs info is stored in a YAML file - in this case, `src/data/clubs.yaml`.

The structure for the data is

```yaml
-   name:   // club name
    url:    // url for the club's website (or facebook page)
    img:    // image in 400x400 ratio, in scr/images/clubs *
    target: // recommend underscore and club name, no spaces
    copy:   // club copy in html formatting

* img path in the file should be clubs/<sponsor_name>.png (or jepg)
```

Logos are 4:3 ratio (preferably 400x300 file size) with a transparent background (so ideally PNG).

All clubs officially affiliated with LSERSA (as notified by SSE) are listed, as well as
DSUK which has two local groups.

### Slopes

Data for the slopes is held in **two** files; the main one is another YAML file at
`src/data/slopes.yaml` with the following structure:

```yaml
-   name:      // slope/centre name
    url:       // url for the slope's website
    map_url :  // url for a Google maps search of the centre name at 2km scale
    img:       // image in 400x200 ratio, in scr/images/slopes *
    target:    // recommend underscore and slope name, no spaces
    copy:      // club copy in html formatting

* img path in the file should be slopes/<sponsor_name>.png (or jepg)
```
**In addition** there is also a second file with JSON data at `src/lib/slopedata.js`. This
repeats the `name`, `url`, `map-url` and `target` fields, whilst also adding latitude and
longitude values (and is used by the API function `getslopes` to determine distance from the
given postcode).

[⥣ back to index](#index)

## Booking System

### Database

The backend for the booking system is a MySQL database on PlanetScale, accessed by API routes on
the website (provided as Gatsby functions). The database structure is:

![database schema diagram](./_db_info/LSERSA%20booking%20schema.png)

[⥣ back to index](#index)




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
- [x] not sure where, but minutes etc
- [x] clubs page
- [x] add blurb and links for clubs
- [x] do we also want to put in slopes?
- [x] add favicon
- [x] sponsor carousel
- [ ] link "highlight hover" doesn't work if the link is over multiple rows