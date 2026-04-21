
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

function App() {
  const [markdownContent, setMarkdownContent] = useState('');
  const [activeSection, setActiveSection] = useState('القسم الأول: إدارة الذات والوقت في عصر الذكاء الاصطناعي');

  useEffect(() => {
    fetch('/content.md')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then(text => {
        setMarkdownContent(text);
        console.log('Fetched markdown content length:', text.length);
      })
      .catch(error => console.error('Error fetching markdown:', error));
  }, []);

  const getSectionContent = (sectionTitle) => {
    console.log('Attempting to get content for section:', sectionTitle);
    if (!markdownContent) {
      console.log('markdownContent is empty.');
      return '';
    }

    // Escape special characters in sectionTitle for regex
    const escapedSectionTitle = sectionTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Regex to find the section content, starting after the section title and ending before the next section title or end of file
    const regex = new RegExp(`## ${escapedSectionTitle.split(':')[0]}[^\n]*\n([^]*?)(?=\n## القسم|$|---)`, 's');
    const match = markdownContent.match(regex);

    if (match && match[1]) {
      console.log('Content found for section:', sectionTitle);
      return match[1].trim();
    } else {
      console.log('No content found for section:', sectionTitle);
      console.log('Markdown content start:', markdownContent.substring(0, 500)); // Log first 500 chars for debugging
      return '';
    }
  };

  const sections = [
    'القسم الأول: إدارة الذات والوقت في عصر الذكاء الاصطناعي',
    'القسم الثاني: إدارة المهارات والتعلم المستمر في عصر الذكاء الاصطناعي',
    'القسم الثالث: إدارة العلاقات الإنسانية في عصر الذكاء الاصطناعي',
    'القسم الرابع: المهارات الناعمة (Soft Skills) في عصر الذكاء الاصطناعي',
    'القسم الخامس: التفكير النقدي وإعادة ترتيب الأولويات في عصر الذكاء الاصطناعي',
    'القسم السادس: مصادر وأدوات في عصر الذكاء الاصطناعي'
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">دليل الصمود والازدهار في عصر الذكاء الاصطناعي</h1>
        <nav>
          <ul className="flex space-x-4">
            {sections.map((section, index) => (
              <li key={index}>
                <button
                  onClick={() => setActiveSection(section)}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${activeSection === section ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                >
                  {section.split(':')[0]}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto p-6">
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-3xl font-semibold text-blue-600 dark:text-blue-400 mb-4">{activeSection}</h2>
          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              children={getSectionContent(activeSection)}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={dracula}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 shadow-md p-4 text-center text-gray-600 dark:text-gray-400">
        <p>&copy; 2025 دليل الصمود والازدهار في عصر الذكاء الاصطناعي. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
}

export default App;


