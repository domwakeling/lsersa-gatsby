import React, { useState, useEffect, useRef } from "react";
import sponsorData from '../data/sponsors.yaml';
import { useSponsorImages } from "../lib/hooks/use-sponsor-images";
import { GatsbyImage, getImage } from "gatsby-plugin-image";

const Carousel = () => {
    const [index, setIndex] = useState(0);
    const ref = useRef(null);
    
    // map each image so we have the relative path and gatsby image data
    const imgData = useSponsorImages().allFile.nodes.map(node => ({
        path: node.relativePath,
        image: getImage(node)
    }));

    useEffect(() => {
        const interval = setInterval(() => {
            ref.current.className = "carousel-hidden";
            setTimeout(() => {
                setIndex(index >= (sponsorData.length - 1) ? 0 : index + 1);
                ref.current.className = "carousel-visible";
            }, 1000);
        }, 5000);

        //Clearing the interval
        return () => clearInterval(interval);
    }, [index]);

    return (
        <div
            className="carousel-visible"
            ref={ref}
            style={{
                height: "150px",
                width: "200px",
                margin: "1em auto 1em"
            }}
        >
            <a
                className="sponsor-carousel-image"
                href={sponsorData[index].url}
                target={sponsorData[index].target}
            >
                <GatsbyImage
                    image={imgData.filter(node => node.path === sponsorData[index].img)[0].image}
                    alt={sponsorData[index].name}
                />
            </a>
        </div>
    )
}

export default Carousel;