import { graphql, useStaticQuery } from "gatsby"

export const useSponsorImages = () => {
    const data = useStaticQuery(graphql`
        query FindSponsorImages {
            allFile(
                filter: { sourceInstanceName: { eq: "images" }, relativePath: { regex: "/sponsors/" } }
            ) {
                    nodes {
                    relativePath
                        childImageSharp {
                        gatsbyImageData(width: 200, formats: [WEBP, PNG])
                    }
                }
            }
        }
    `)

    return data;
}