
import Header from "@/components/layout/header";
import { PeriodReadyChecklist } from "@/components/info/PeriodReadyChecklist";

export default function ChecklistPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex-1 container mx-auto px-4 md:px-6 py-12 flex items-center justify-center">
                <PeriodReadyChecklist />
            </div>
        </div>
    )
}
