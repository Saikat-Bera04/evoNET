import PageHeader from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

export default function AdminPage() {
    return (
        <div className="container py-8">
            <PageHeader 
                title="Admin & Developer Portal"
                description="Backend control and monitoring for the EvoNFT platform."
            />
            <div className="mt-12 max-w-2xl mx-auto">
                 <Card className="text-center">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-center gap-2">
                           <Shield className="h-8 w-8 text-primary"/>
                           Access Restricted
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                       <p className="text-muted-foreground">This area is for authorized administrators and developers only. Please connect a whitelisted wallet to proceed.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
