import { Level, Role, type UserProfileData } from "@utils/types/user";
import type { ChangeEvent } from "react";

interface ProfileEducationComponentProps {
  user: UserProfileData;
  isEditing: boolean;
  formData: {
    level: string;
    teachingLevels?: string[];
    languages?: string[];
    yearsOfExperience?: number;
  };
  setFormData: (_: (prev: any) => any) => void;
  handleInputChange: (_: ChangeEvent<HTMLInputElement>) => void;
}

const ProfileEducationComponent = ({
  user,
  isEditing,
  formData,
  setFormData,
  handleInputChange,
}: ProfileEducationComponentProps) => {
  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm space-y-4">
      <h3 className="text-sm font-bold uppercase tracking-widest text-teal-600">
        Education
      </h3>

      {user.role === Role.STUDENT && user.student && (
        <div className="space-y-1.5">
          <div className="text-xs text-neutral-400 font-semibold uppercase">
            Level
          </div>
          {isEditing ? (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {(Object.values(Level) as string[]).map((lvl) => {
                const checked = formData.level.includes(lvl);
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        level: lvl,
                      }))
                    }
                    className={`text-xs font-bold px-2 py-0.5 rounded-md border transition cursor-pointer ${
                      checked
                        ? "bg-teal-600 text-white border-teal-600"
                        : "bg-teal-50 text-teal-700 border-teal-100 hover:border-teal-400"
                    }`}
                  >
                    {lvl.charAt(0) + lvl.slice(1).toLowerCase()}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 border border-teal-100">
                {user.student.level}
              </span>
            </div>
          )}
        </div>
      )}

      {user.role === Role.TEACHER && user.teacher && (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="text-xs text-neutral-400 font-semibold uppercase">
              Teaching Levels
            </div>
            {isEditing ? (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {(Object.values(Level) as string[]).map((lvl) => {
                  const checked = (formData.teachingLevels ?? []).includes(lvl);
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          teachingLevels: checked
                            ? (prev.teachingLevels ?? []).filter(
                                (l: string) => l !== lvl,
                              )
                            : [...(prev.teachingLevels ?? []), lvl],
                        }))
                      }
                      className={`text-xs font-bold px-2 py-0.5 rounded-md border transition cursor-pointer ${
                        checked
                          ? "bg-teal-600 text-white border-teal-600"
                          : "bg-teal-50 text-teal-700 border-teal-100 hover:border-teal-400"
                      }`}
                    >
                      {lvl.charAt(0) + lvl.slice(1).toLowerCase()}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {user.teacher.teachingLevels.map((lvl) => (
                  <span
                    key={lvl}
                    className="text-xs font-bold px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 border border-teal-100"
                  >
                    {lvl}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-1.5 pt-2 border-t border-neutral-100">
            <div className="text-xs text-neutral-400 font-semibold uppercase">
              Languages
            </div>
            {isEditing ? (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  "English",
                  "Arabic",
                  "French",
                  "Spanish",
                  "German",
                  "Italian",
                  "Portuguese",
                  "Chinese",
                  "Japanese",
                  "Turkish",
                ].map((lang) => {
                  const checked = (formData.languages ?? []).includes(lang);
                  return (
                    <button
                      key={lang}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          languages: checked
                            ? prev.languages.filter((l: string) => l !== lang)
                            : [...prev.languages, lang],
                        }))
                      }
                      className={`text-xs font-medium px-2 py-0.5 rounded-md border transition cursor-pointer ${
                        checked
                          ? "bg-neutral-700 text-white border-neutral-700"
                          : "bg-neutral-100 text-neutral-700 border-neutral-200 hover:border-neutral-400"
                      }`}
                    >
                      {lang}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {user.teacher.languages.map((lang) => (
                  <span
                    key={lang}
                    className="text-xs font-medium px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="text-xs text-neutral-400 font-semibold uppercase">
              Years of Experience
            </div>
            {isEditing ? (
              <input
                type="number"
                name="yearsOfExperience"
                min="0"
                value={formData.yearsOfExperience}
                onChange={handleInputChange}
                className="w-full text-sm bg-neutral-50 border border-neutral-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl px-3 py-2 font-bold text-neutral-900 outline-none transition"
              />
            ) : (
              <div className="text-base font-bold text-neutral-900">
                {user.teacher.yearsOfExperience ?? 0}{" "}
                {user.teacher.yearsOfExperience === 1 ? "Year" : "Years"}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileEducationComponent;
