import { useState } from "react";
import { MobileNavigation } from "@/components/MobileNavigation";
import { Dashboard } from "@/components/Dashboard";
import { InvoiceList } from "@/components/InvoiceList";
import { CreateInvoice } from "@/components/CreateInvoice";
import { Invoice } from "@/types/invoice";

export const InvoiceApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

  const handleCreateInvoice = () => {
    setEditingInvoice(null);
    setActiveTab('create');
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setActiveTab('create');
  };

  const handleBackFromCreate = () => {
    setEditingInvoice(null);
    setActiveTab('dashboard');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onCreateInvoice={handleCreateInvoice} />;
      case 'invoices':
        return <InvoiceList onEditInvoice={handleEditInvoice} />;
      case 'create':
        return <CreateInvoice onBack={handleBackFromCreate} editingInvoice={editingInvoice} />;
      case 'clients':
        return (
          <div className="space-y-4 pb-20">
            <h1 className="text-2xl font-bold">Clients</h1>
            <p className="text-muted-foreground">Client management coming soon...</p>
          </div>
        );
      case 'reports':
        return (
          <div className="space-y-4 pb-20">
            <h1 className="text-2xl font-bold">Reports</h1>
            <p className="text-muted-foreground">Analytics and reports coming soon...</p>
          </div>
        );
      default:
        return <Dashboard onCreateInvoice={handleCreateInvoice} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">IT</span>
              </div>
              <span className="font-bold text-lg">InvoiceTemple</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6">
        {renderContent()}
      </main>

      {/* Mobile Navigation */}
      <MobileNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};