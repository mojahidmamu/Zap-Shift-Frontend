import { useState } from "react";
import { HelpCircle, Plus } from "lucide-react";

const faqsData = [
  {
    id: 1,
    question: "What is this platform about?",
    answer:
      "This platform allows users to explore and manage sports equipment easily, helping them find, add, and organize items efficiently.",
  },
  {
    id: 2,
    question: "Do you need to create an account?",
    answer:
      "No account is required to browse. However, you need to sign in to add or manage your equipment.",
  },
  {
    id: 3,
    question: "Can I add my own equipment?",
    answer:
      "Yes, logged-in users can add their own sports equipment with details like name, price, and description.",
  },
  {
    id: 4,
    question: "Is my data secure?",
    answer:
      "Yes, your information is securely handled using authentication and protected routes to ensure privacy and safety.",
  },
  {
    id: 5,
    question: "Can I update or delete my equipment?",
    answer:
      "Absolutely! You can easily update or remove any equipment you have added from your personal dashboard.",
  }
]

const FAQ = () => {
  const [activeId, setActiveId] = useState(1); // first open by default

  const toggleFaq = (id) => {
    setActiveId(activeId === id ? null : id);
  };

  return (
    <section className="py-6 px-4 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          {/* Title */}
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            <span className="text-slate-900 dark:text-white">Common </span>
            <span className="bg-gradient-to-r from-purple-500 via-indigo-500 to-teal-400 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>

          {/* Underline */}
          <div className="flex justify-center">
            <span className="h-1 w-28 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500"></span>
          </div>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-slate-500 text-base md:text-lg">
            Everything you need to know about my services and workflow.
          </p>
        </div>

        {/* FAQ Cards */}
        <div className="space-y-5">
          {faqsData.map((faq) => {
            const isOpen = activeId === faq.id;

            return (
              <div
                key={faq.id}
                className={`relative rounded-2xl border bg-white dark:bg-slate-900 transition-all duration-300 shadow-sm hover:shadow-md ${
                  isOpen
                    ? "border-purple-500/40"
                    : "border-slate-200 dark:border-slate-800"
                }`}
              >
                {/* Gradient Accent */}
                <div
                  className={`absolute left-0 top-0 h-full w-1 rounded-l-2xl transition-all ${
                    isOpen
                      ? "bg-gradient-to-b from-purple-500 to-pink-500"
                      : "bg-transparent"
                  }`}
                />

                {/* Question */}
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {faq.question}
                  </h3>

                  <span
                    className={`flex items-center justify-center h-9 w-9 rounded-full border transition-all ${
                      isOpen
                        ? "bg-purple-600 text-white rotate-45"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600"
                    }`}
                  >
                    <Plus size={18} />
                  </span>
                </button>

                {/* Answer */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden px-6 pb-6 text-slate-600 dark:text-slate-400 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;

 