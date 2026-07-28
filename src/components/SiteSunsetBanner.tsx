"use client";

import { useState } from "react";
import Link from "next/link";
import { isCN } from "@/lib/env";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";

export default function SiteSunsetBanner() {
  const t = useTranslations("SiteBanner");
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return null;
  }

  const dismiss = () => {
    setDismissed(true);
  };

  return (
    <div className="w-full border-b border-amber-300 bg-amber-50 text-amber-950">
      <div className="relative mx-auto flex min-h-11 w-full max-w-[1280px] items-center justify-center gap-1 px-12 py-2 text-center text-sm font-medium md:gap-2 md:px-16">
        <span>
          {isCN ? t("domestic") : t("international")}{" "}
          <Link
            href="https://treease.com?utm_source=json4u"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 hover:text-amber-700"
          >
            {"treease.com"}
          </Link>
          {isCN ? t("domesticSuffix") : t("internationalSuffix")}
        </span>
        <button
          type="button"
          onClick={dismiss}
          aria-label={t("dismiss")}
          className="absolute right-3 rounded-sm p-1 text-amber-800 transition-colors hover:bg-amber-100 hover:text-amber-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 md:right-6"
        >
          <X aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
