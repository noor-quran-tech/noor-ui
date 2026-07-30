import { useState } from "react";

const faqItems = [
  {
    question: "Do you offer one-on-one lessons or group classes?",
    answer:
      "We offer both options. You can choose one-on-one lessons for personalized attention or join small group classes with no more than 5 students to ensure a high-quality learning experience.",
  },
  {
    question: "How can I choose the most suitable lesson schedule?",
    answer:
      "Our academy operates 24/7 to accommodate students across different time zones. After registering, you can choose the lesson times that best fit your daily schedule.",
  },
  {
    question: "What qualifications do your teachers have?",
    answer:
      "All of our teachers are certified in Quran recitation and memorization by recognized institutions, including Al-Azhar, and have extensive experience teaching both children and adults online.",
  },
  {
    question: "Do you offer a free trial lesson?",
    answer:
      "Yes! We offer a completely free trial lesson for all new students. It allows you to assess your level and experience our teaching approach before subscribing to any plan.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept credit and debit cards, PayPal, and direct bank transfers, making it easy for students around the world to subscribe to our programs.",
  },
];

const FAQ = () => {
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);

  const handleOpenQuestion = (idx: number) => {
    if (openQuestion === idx + 1) setOpenQuestion(null);
    else setOpenQuestion(idx + 1);
  };

  return (
    <section className="bg-neutral-50 py-16">
      <div className="mx-auto max-w-4xl px-6">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-neutral-900">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-neutral-600">
            Everything you need to know before starting your learning journey.
          </p>
        </div>

        <div className="space-y-4">
          {faqItems.map((item, idx) => {
            const isOpen = openQuestion === idx + 1;

            return (
              <div
                key={item.question}
                className={`overflow-hidden rounded-2xl border transition-all duration-300 cursor-pointer
                ${
                  isOpen
                    ? "border-teal-500 bg-white shadow-md shadow-teal-100"
                    : "border-neutral-200 bg-white hover:border-teal-300 hover:shadow-md"
                }`}
                onClick={() => handleOpenQuestion(idx)}
              >
                <div className="flex items-center justify-between px-6 py-5">
                  <h3 className="text-lg font-semibold text-neutral-900">
                    {item.question}
                  </h3>

                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300
                    ${
                      isOpen
                        ? "rotate-180 bg-teal-500 text-white"
                        : "bg-teal-100 text-teal-700"
                    }`}
                  >
                    ▼
                  </div>
                </div>

                {isOpen && (
                  <div className="animate-fade-in border-t border-neutral-100 px-6 py-5">
                    <p className="leading-8 text-neutral-600">{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
