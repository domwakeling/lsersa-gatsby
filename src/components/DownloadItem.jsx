import React from "react";

const DownloadItem = ({ filetype, filename, filelink }) => {

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
        default:
            fileImgUrl = "/pdf_download.png";
    }
    
    return (
        <div style={{ width: "150px", display: "inline-block", marginRight: '10px' }}>
            <a href={filelink} target="_download">
                <div style={{ width: "100%" }}>
                    <img
                        src={fileImgUrl}
                        height="80"
                        width="72"
                        style={{ paddingLeft: "39px", width: "72px", height: "auto" }}
                        alt="download"
                    />
                </div>
                <p style={{ textAlign: "center", marginTop: "0.2rem" }}>{filename}</p>
            </a>
        </div>
    )
}

export default DownloadItem;