import React, { useState } from 'react';
import { toast } from 'sonner';
import { css, cva } from 'styled-system/css';

interface Props {
    text: string;
}

const containerStyle = css({
    display: 'inline-block',
    maxWidth: '100%',
    cursor: 'pointer',
    padding: '2px 4px',
    borderRadius: '4px',
    backgroundColor: '#f0f0f0',
    transition: 'background-color 0.3s ease',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    _hover: {
        backgroundColor: '#e0e0e0',
    }
});

const ClickToCopyWithToast = ({ text }: Props) => {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied!', {
        duration: 2000,
        position: 'bottom-center',
      });
    } catch (err) {
      console.error('Failed to copy text: ', err);
      toast.error('Failed to copy');
    }
  };

  return (
    <>
      <span 
        onClick={copyToClipboard}
        className={containerStyle}
        title="Click to copy"
      >
        {text}
      </span>
    </>
  );
};

export default ClickToCopyWithToast;