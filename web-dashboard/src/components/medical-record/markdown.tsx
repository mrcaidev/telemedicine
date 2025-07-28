import ReactMarkdown from "react-markdown";

export function MarkdownPreview({ content }: { content: string }) {
  return (
    <div className="max-h-[60vh] overflow-auto text-sm text-gray-800 space-y-2">
      <ReactMarkdown
        components={{
          h1: (props) => (
            <h1 className="text-lg font-bold mt-4 mb-2" {...props} />
          ),
          h2: (props) => (
            <h2 className="text-base font-semibold mt-3 mb-1" {...props} />
          ),
          p: (props) => (
            <p
              className="whitespace-pre-line mb-2 leading-relaxed"
              {...props}
            />
          ),
          ul: (props) => (
            <ul className="list-disc pl-5 space-y-1" {...props} />
          ),
          li: (props) => <li className="ml-2" {...props} />,
          strong: (props) => (
            <strong className="font-semibold text-gray-900" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
