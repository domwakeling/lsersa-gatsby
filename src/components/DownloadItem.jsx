import React from "react";

const DownloadItem = ({ filetype, filename, filelink, mini }) => {

    const miniImg = mini ? true: false;

    let fileImgUrl = "";
    switch (filetype) {
        case 'PDF':
            fileImgUrl = "/images/pdf_download.png";
            break;
        case 'XLS':
            fileImgUrl = "/images/excel_download.png";
            break;
        case 'XLSX':
            fileImgUrl = "/images/excel_download.png";
            break;
        case 'XLSM':
            fileImgUrl = "/images/excel_download.png";
            break;
        case 'excel':
            fileImgUrl = "/images/excel_download.png";
            break;
        case 'DOC':
            fileImgUrl = "/images/word_download.png";
            break;
        case 'DOCX':
            fileImgUrl = "/images/word_download.png";
            break;
        case 'word':
            fileImgUrl = "/images/word_download.png";
            break;
        default:
            fileImgUrl = "/images/pdf_download.png";
    }

    const divStyle = miniImg ? ({
        display: "inline-block",
        marginRight: '10px'
    }) : ({
        width: "150px",
        display: "inline-block",
        marginRight: '10px'
    })

    const imgStyle = miniImg ? ({
        width: "36px",
        height: "auto",
        marginTop: "0.2rem",
        marginRight: "1.0rem"
    }) : ({
        paddingLeft: "39px",
        width: "72px",
        height: "auto",
        marginTop: "0.2rem"
    })
    
    return (
        <div style={divStyle}>
            <a href={filelink} target="_download">
                <div style={{ width: "100%" }}>
                    {miniImg && (
                        <div
                            style={{
                                verticalAlign: "middle", 
                                display: "inline-block", 
                                position: "relative", 
                                bottom: "1.2rem",
                                marginRight: "0.6rem"
                            }}
                        >{filename}</div>
                    )}
                    <img
                        src={fileImgUrl}
                        height={miniImg ? "40" : "80"}
                        width={miniImg ? "36" : "72"}
                        style={imgStyle}
                        alt="download"
                    />
                </div>
                { !miniImg && (
                    <p style={{
                        textAlign: "center",
                        marginTop: "0",
                        marginBottom: "0.3rem"
                    }}>{filename}</p>
                )}
            </a>
        </div>
    )
}

export default DownloadItem;