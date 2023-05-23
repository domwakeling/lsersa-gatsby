const htmlBlank = `<!DOCTYPE html
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" >
<html xmlns="http://www.w3.org/1999/xhtml">

    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>LSERSA Email</title>
        <style>
            a.underlined {
                position: relative;
            z-index: 6;
            }
            a.underlined:hover {
                text - decoration: none;
            }
            a.underlined:hover::before {
                content: '';
            background-color: rgba(255,199,13,.65);
            position: absolute;
            left: 0;
            bottom: 3px;
            width: 100%;
            height: 4px;
            z-index: 0;
            }
        </style>
    </head>

    <body style="margin:0;background-color:#F1F3FD;color:#05081E;font-family:sans-serif;">
        <center class="wrapper" style="width:100%;table-layout:fixed;background-color:#F1F3FD;padding-bottom:60px;">
            <table class="main" width="100%"
                style="background-color:#ffffff;margin:0 auto;width:100%;max-width:600px;border-spacing:0;">
                <!-- TOP BORDER -->
                <tr>
                    <td height="8" style="padding:0;background-color: #172A95;"></td>
                </tr>
                <!-- LOGO SECTION -->
                <tr>
                    <td style="padding:0;">
                        <table class="column" width="100%" style="border-spacing:0;padding-left:8px;padding-right:8px;">
                            <tr>
                                <td width="80px" style="padding: 10px 0 0 0; margin: 0;">
                                    <img width="70px" height="90px" alt="LSERSA logo"
                                        src="https://lsersa.org/images/lsersa_140x180.png"
                                        style="border:0; margin: 0;">
                                </td>
                                <td style="padding: 10px 0px 0px 0px;">
                                    <h1 style="font-size: 60px; padding-top: 0px; margin: 0; font-weight: 500;">LSERSA</h1>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <!-- BODY SECTION -->
                <tr>
                    PLACEHOLDER_SECTION
                </tr>
                <!-- FOOTER SECTION -->
                <tr class="footer" style="background-color:#172A95;color:white;width:100%;text-align:center;">
                    <td style="padding:0;padding-top: 16px; padding-bottom: 15px;">
                        <table width="100%" style="border-spacing:0;">
                            <tr>
                                <td class="row" style="padding:0;padding-bottom:16px;text-align: center; color: white;">
                                    LONDON &amp; SOUTH EAST REGIONAL SNOWSPORTS ASSOCIATION</td>
                            </tr>
                            <tr>
                                <td style="padding:0;">
                                    <table style="border-spacing:0;width: 120px; margin: 0 auto;">
                                        <tr>
                                            <td style="padding:0;">
                                                <a href="https://www.facebook.com/LSERSA/">
                                                    <img width="50px" alt="LSERSA facebook"
                                                        src="https://lsersa.org/images/fb_100.png"
                                                        style="border:0; margin-right: 15px;">
                                                </a>
                                                <a href="https://www.instagram.com/lsersa_uk/">
                                                    <img width="50px" alt="LSERSA instagram"
                                                        src="https://lsersa.org/images/ig_100.png"
                                                        style="border:0;">
                                                </a>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </center>
    </body>

</html>`

export {
    htmlBlank
}