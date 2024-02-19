// 文档内容
export function getDocContent(url: string) {
  return /*html*/ `
  <!DOCTYPE html>
  <html lang="">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <title>文档</title>
    </head>
    <style>
      html,body,iframe{
        width:100%;
        height:100%;
        border:0;
        overflow: hidden;
        background-color: #fff;
      }
    </style>
    <body>
      <iframe src="${url}"/>
    </body>
  </html>
  `
}
