import React from "react";

const DownloadItem = ({ filetype, filename, filelink, mini }) => {

    const miniImg = mini ? true: false;

    let fileImgUrl = "";
    switch (filetype) {
        case 'PDF':
            fileImgUrl = "/pdf_download.png";
            break;
        case 'XLS':
            fileImgUrl = "/excel_download.png";
            break;
        case 'XLSX':
            fileImgUrl = "/excel_download.png";
            break;
        case 'XLSM':
            fileImgUrl = "/excel_download.png";
            break;
        case 'excel':
            fileImgUrl = "/excel_download.png";
            break;
        case 'DOC':
            fileImgUrl = "/word_download.png";
            break;
        case 'DOCX':
            fileImgUrl = "/word_download.png";
            break;
        case 'word':
            fileImgUrl = "/word_download.png";
            break;
        default:
            fileImgUrl = "/pdf_download.png";
    }
    
    return (
        <div style={{
            width: miniImg ? "100px" : "150px",
            display: "inline-block",
            marginRight: '10px'
        }}>
            <a href={filelink} target="_download">
                <div style={{ width: "100%" }}>
                    <img
                        src={fileImgUrl}
                        height={miniImg ? "40" : "80"}
                        width={miniImg ? "36" : "72"}
                        style={{
                            paddingLeft: miniImg ? "32px" : "39px",
                            width: miniImg ? "36px": "72px" ,
                            height: "auto",
                            marginTop: "0.2rem"
                        }}
                        alt="download"
                    />
                </div>
                <p style={{
                    textAlign: "center",
                    marginTop: "0",
                    marginBottom: "0.3rem"
                }}>{filename}</p>
            </a>
        </div>
    )
}

export default DownloadItem;