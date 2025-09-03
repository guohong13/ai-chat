"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/atom-one-dark.css";

import { Box, useTheme } from "@mui/material";
import CodeBlock from "./CodeBlock";

interface MarkdownRendererProps {
  children: string;
  isStreaming?: boolean;
}

const getRawText = (node: React.ReactNode): string => {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getRawText).join("");

  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    return getRawText(node.props.children);
  }

  return "";
};

export default function MarkdownRenderer({ children }: MarkdownRendererProps) {
  const theme = useTheme();
  return (
    <Box sx={{ display: "flex", alignItems: "flex-start" }}>
      <Box
        component="div"
        sx={{
          flexGrow: 1,
          overflow: "hidden",
          ...theme.typography.body1,
          lineHeight: 1.6,
          wordWrap: "break-word",
          "& h1, & h2, & h3, & h4, & h5, & h6": {
            marginTop: "0.5em",
            marginBottom: "0.5em",
            fontWeight: 600,
          },
          "& blockquote": {
            margin: "0 0 1em 0",
            padding: "0.5em 1em",
            color: "inherit",
            borderLeft: "0.25em solid #dfe2e5",
            backgroundColor: "rgba(0, 0, 0, 0.02)",
          },
          "& code": {
            fontFamily:
              '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace',
            fontSize: "0.9em",
            padding: "0.2em 0.4em",
            margin: 0,
            backgroundColor: "rgba(27, 31, 35, 0.05)",
            borderRadius: theme.shape.borderRadius,
          },
          "& a": {
            color: "#0366d6",
            textDecoration: "none",
            "&:hover": {
              textDecoration: "underline",
            },
          },
        }}
      >
        <ReactMarkdown
          rehypePlugins={[rehypeHighlight]}
          components={{
            a: ({ node, ...props }) => (
              <a {...props} target="_blank" rel="noopener noreferrer" />
            ),

            pre: (props) => {
              const { node, children, ...rest } = props;
              const childrenArray = React.Children.toArray(children);
              const codeElement =
                childrenArray.length > 0 &&
                React.isValidElement(childrenArray[0])
                  ? (childrenArray[0] as React.ReactElement)
                  : null;

              if (codeElement && codeElement.type === "code") {
                const elementProps = codeElement.props as {
                  className?: string;
                  children?: React.ReactNode;
                };
                const { className } = elementProps;
                const match = /language-(\w+)/.exec(className || "");
                const language = match ? match[1] : "text";
                const rawCode = getRawText(elementProps.children);

                return (
                  <CodeBlock language={language} rawCode={rawCode}>
                    <pre {...rest}>{children}</pre>
                  </CodeBlock>
                );
              }
              return <pre {...rest}>{children}</pre>;
            },
          }}
        >
          {children}
        </ReactMarkdown>
      </Box>
    </Box>
  );
}
