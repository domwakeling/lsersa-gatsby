import React from 'react';

const ListParser = ({ html }) => {
    const items = html
        .replace(/<\/?ul>/g, "")
        .split(/<\/li>\s*?/g)
        .map(item => item.replace(/<li>/g, ""))
        .filter(item => item.length > 2);

    return (
        <ul>
            {
                items.map((item, idx) => (
                    <li key={idx}>{item}</li>
                ))
            }
        </ul>
    )
}

const ParaParser = ({ html }) => {
    const str = html
        .replace(/<\/?p>/g, "");
    
    if (/<a/.test(str)) {
        const items = str
            .split(/<\/?a>?/)
            .map((item, idx) => {
                if (idx % 2 === 0) return item;
                
                const url = item.match(/href="([A-Za-z0-9@.:#?&/\-_]+)"/)[1];
                
                let target = item.match(/target="([A-Za-z0-9@.:#?&/\-_]+)"/);
                
                if (target !== null) target = target[1];
                
                let text = item.match(/>(.*$)/)[1];

                return {
                    url,
                    target,
                    text
                }
            });
        
        return (
            <p>
                {
                    items.map((item, idx) => (
                        idx % 2 === 0 ? (
                            item
                        ) : (
                            <a key={idx} href={item.url} target={item.target}>{item.text}</a>
                        )
                    ))
                }
            </p>
        )
    }

    return (
        <p>
            {str}
        </p>
    )
}

const ParserHelper = ({ html }) => {
    if ( /^<ul>/.test(html)) {
        return (
            <ListParser html={html} />
        )
    }
    return (
        <ParaParser html={html} />
    )
}

const SponsorParser = ({ rawHTML }) => {
    
    const splitPara = rawHTML
        .replace(/(?:\r|\n)/g, " ")
        .replace(/\s{2,}/g, " ")
        .replace(/\s{2,}/g, "")
        .split(/<\/(?:p|ul)>/)
        .map(str => str.replace(/^\s*/, ""))
        .map(str => str.replace(/^<(p|ul)>(.*)$/, "<$1>$2</$1>"));

    return (
        <>
            {
                splitPara.map((para, idx) => (
                    <ParserHelper key={idx} html={para} />
                ))
            }
        </>
    )
}

export default SponsorParser;