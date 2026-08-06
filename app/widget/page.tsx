import { notFound } from "next/navigation";
import { getBusinessContextById } from "@/lib/businesses";
import { ChatWidget } from "@/components/chat-widget";
import { TransparentFrameOverrides } from "./transparent-frame-overrides";

interface PageProps {
  searchParams: Promise<{ businessId?: string }>;
}

export default async function WidgetPage({ searchParams }: PageProps) {
  const { businessId } = await searchParams;

  if (!businessId) {
    return notFound();
  }

  const context = await getBusinessContextById(businessId);
  if (!context) {
    return notFound();
  }

  const { business } = context;

  return (
    <>
      <TransparentFrameOverrides />
      <div className="w-full h-full min-h-screen bg-transparent relative">
        <ChatWidget
          businessId={business.id}
          businessName={business.business_name}
          widgetSettings={business.widget_settings}
          primaryColor={business.primary_color}
        />
      </div>
    </>
  );
}
