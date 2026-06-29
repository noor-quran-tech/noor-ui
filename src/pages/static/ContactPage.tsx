import { InqueryTopic } from "@utils/types/inquery";
import React, { useState, type ChangeEvent, type FormEvent } from "react";

import axiosAPI from "@lib/axios";
import { isAxiosError } from "axios";
import { toast } from "sonner";

interface ContactFormData {
  name: string;
  email: string;
  topic: string;
  message: string;
}

const initialFormState: ContactFormData = {
  name: "",
  email: "",
  topic: "",
  message: "",
};

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>(initialFormState);
  const [errors, setErrors] = useState<
    Partial<Record<keyof ContactFormData, string>>
  >({});
  const [isLoading, setLoading] = useState<boolean>(false);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ContactFormData, string>> = {};
    const { name, email, topic, message } = formData;

    if (!name.trim()) newErrors.name = "Name is required";
    if (!/^\S+@\S+\.\S+$/.test(email))
      newErrors.email = "Enter a valid email address";
    if (!topic.trim()) newErrors.topic = "Please select a topic";
    if (!message.trim()) newErrors.message = "Message cannot be empty";
    else if (message.trim().length < 10)
      newErrors.message = "Message must be at least 10 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setLoading(true);
      await axiosAPI.post("/inquiries", formData);
    } catch (err) {
      let errorMessage = "Error submitting the form";
      if (isAxiosError(err)) {
        errorMessage =
          err?.response?.data?.message || err.message || errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      toast.error("Send Failed", { description: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex items-center justify-center p-6 md:p-12">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-5 gap-12 bg-white rounded-2xl overflow-hidden p-2">
        {/* Info Column (Left Side) */}
        <div className="lg:col-span-2 flex flex-col justify-between space-y-8 bg-linear-to-br from-slate-50 to-teal-50/50 p-8 rounded-2xl border border-slate-200">
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
              Get in Touch
            </h1>
            <p className="text-slate-600 leading-relaxed text-sm md:text-base">
              Have questions or need assistance? Drop us a message, and our
              dedicated team will respond shortly.
            </p>
          </div>

          {/* Core Support Meta Blocks */}
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-white rounded-lg border border-slate-200 text-teal-600 shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                  />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">
                  Email Support
                </h4>
                <p className="text-sm text-slate-600 mt-0.5">
                  support@noor.com
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-3 bg-white rounded-lg border border-slate-200 text-teal-600 shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">
                  Headquarters
                </h4>
                <p className="text-sm text-slate-600 mt-0.5">Cairo, Egypt</p>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-400">
            © 2026 Noor Inc. All rights reserved.
          </div>
        </div>

        {/* Interactive Form Column (Right Side) */}
        <div className="lg:col-span-3 flex items-center p-4 lg:p-8">
          <form onSubmit={handleSubmit} noValidate className="w-full space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 focus:bg-white transition"
                  placeholder="John Doe"
                />
                {errors.name && (
                  <span className="text-xs text-red-500">{errors.name}</span>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 focus:bg-white transition"
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <span className="text-xs text-red-500">{errors.email}</span>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Topic
              </label>
              <select
                name="topic"
                value={formData.topic}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 focus:bg-white transition"
              >
                <option value="">Select a topic...</option>
                {Object.values(InqueryTopic).map((topic) => (
                  <option key={topic} value={topic}>
                    {topic.replace(/_/g, " ").toLowerCase()}
                  </option>
                ))}
              </select>
              {errors.topic && (
                <span className="text-xs text-red-500">{errors.topic}</span>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={5}
                className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 focus:bg-white transition resize-none"
                placeholder="How can we help you?"
              />
              {errors.message && (
                <span className="text-xs text-red-500">{errors.message}</span>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="cursor-pointer w-full py-3 bg-teal-600 hover:bg-teal-700 font-semibold text-white rounded-lg shadow-md hover:shadow-lg transition duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span>Sending Message...</span>
              ) : (
                <>
                  <span>Send Message</span>
                </>
              )}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
