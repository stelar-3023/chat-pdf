import React from 'react';

// This code is used to render the PDF on the page.
// It uses an iframe to embed the PDF.
// The pdf_url prop is used to specify the url of the PDF.

type Props = { pdf_url: string };

const PDFViewer = ({ pdf_url }: Props) => {
  return (
    <iframe
      src={`https://docs.google.com/gview?url=${pdf_url}&embedded=true`}
      className='w-full h-full'
    ></iframe>
  );
};

export default PDFViewer;
