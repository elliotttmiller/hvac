"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { DocumentUploadZone } from "@/components/features/ingestion/DocumentUploadZone";
import { toast } from "sonner";
import {
  MapPin,
  Calendar,
  DollarSign,
  FileText,
  Upload,
  ExternalLink,
  Edit,
  Trash2,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Building2,
  Wind,
  Thermometer,
  Download,
  Share2,
} from "lucide-react";

interface Document {
  id: string;
  name: string;
  size: number;
  url: string;
  uploadedAt: string;
  type: string;
}

interface Project {
  id: string;
  name: string;
  location?: string;
  status?: string;
  components?: number;
  estimatedCost?: number;
  date?: string;
  climateZone?: string;
  description?: string;
  uploadedAt?: string;
  analysisDate?: string;
  estimateUpdated?: string;
  documents?: Document[];
}

export default function ProjectDetailsModal({
  project,
  open,
  onOpenChange,
  onDelete,
}: {
  project: Project | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onDelete?: (id: string) => void;
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isDeleting, setIsDeleting] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
  const [confirmDeleteDocId, setConfirmDeleteDocId] = useState<string | null>(null);
  const [confirmDeleteProject, setConfirmDeleteProject] = useState(false);

  // Helper function to fetch documents
  const refreshDocuments = useCallback(() => {
    if (!project?.id) {
      setDocuments([]);
      return;
    }

    setIsLoadingDocuments(true);
    fetch(`/api/projects/${project.id}`)
      .then((res) => res.json())
      .then((data) => {
        setDocuments(data.documents || []);
      })
      .catch((err) => {
        console.error('Failed to load documents:', err);
        setDocuments([]);
      })
      .finally(() => {
        setIsLoadingDocuments(false);
      });
  }, [project?.id]);

  // Fetch documents when project changes
  useEffect(() => {
    refreshDocuments();
  }, [refreshDocuments]);

  if (!project) return null;

  // Helper: friendly date
  const friendlyDate = (d?: string) => {
    try {
      return d ? new Date(d).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }) : "—";
    } catch {
      return d ?? "—";
    }
  };

  const handleDelete = async () => {
    // show confirmation dialog
    if (!project.id) return;
    setConfirmDeleteProject(true);
  };

  const handleCopyId = () => {
    if (!project.id) return;
    navigator.clipboard.writeText(project.id).then(() => {
      toast.success("Project ID copied to clipboard");
    }).catch((err) => {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy to clipboard");
    });
  };

  const handleShare = async () => {
    if (!project.id) return;
    
    // Generate shareable link
    const shareUrl = `${window.location.origin}/workspace/${project.id}`;
    
    try {
      if (navigator.share) {
        // Use native share API if available
        await navigator.share({
          title: project.name,
          text: `Check out this HVAC project: ${project.name}`,
          url: shareUrl,
        });
        toast.success("Project shared successfully");
      } else {
        // Fallback to copying link
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Project link copied to clipboard");
      }
    } catch (err) {
      console.error("Failed to share:", err);
      toast.error("Failed to share project");
    }
  };

  const handleExport = async () => {
    if (!project.id) return;
    
    try {
      // Create JSON export of project data
      const exportData = {
        project: {
          id: project.id,
          name: project.name,
          location: project.location,
          status: project.status,
          components: project.components,
          estimatedCost: project.estimatedCost,
          climateZone: project.climateZone,
          description: project.description,
        },
        documents: documents,
        exportedAt: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.name.replace(/\s+/g, '_')}_export.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("Project data exported successfully");
    } catch (err) {
      console.error("Failed to export:", err);
      toast.error("Failed to export project data");
    }
  };

  const handleDownload = async (documentId: string, documentName: string, documentUrl: string) => {
    try {
      toast.info("Downloading document...");
      
      // Fetch the document
      const response = await fetch(documentUrl);
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = documentName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("Document downloaded successfully");
    } catch (err) {
      console.error("Failed to download:", err);
      toast.error("Failed to download document");
    }
  };

  const handleUploadSuccess = (documentId?: string, url?: string) => {
    toast.success("Document uploaded successfully");
    refreshDocuments();
  };
  
  // Helper to access the document being confirmed for deletion
  const docToDelete = confirmDeleteDocId ? documents.find((d) => d.id === confirmDeleteDocId) : undefined;

  const handleDeleteDocument = async (documentId: string) => {
    // open confirmation dialog
    setConfirmDeleteDocId(documentId);
  };

  const performDeleteDocument = async (documentId: string) => {
    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Delete failed');

      setDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
      toast.success('Document deleted successfully');
    } catch (err) {
      console.error('Failed to delete document:', err);
      toast.error('Failed to delete document');
    } finally {
      setConfirmDeleteDocId(null);
    }
  };

  const performDeleteProject = async () => {
    if (!project?.id) return;
    setIsDeleting(true);
    try {
      if (onDelete) {
        onDelete(project.id);
      }
      onOpenChange(false);
    } finally {
      setIsDeleting(false);
      setConfirmDeleteProject(false);
    }
  };

  // Status configuration
  const getStatusConfig = (status?: string) => {
    switch (status) {
      case "Completed":
        return { variant: "default" as const, icon: CheckCircle2, color: "text-green-500" };
      case "In Progress":
        return { variant: "secondary" as const, icon: Clock, color: "text-blue-500" };
      default:
        return { variant: "outline" as const, icon: AlertCircle, color: "text-muted-foreground" };
    }
  };

  const statusConfig = getStatusConfig(project.status);
  const StatusIcon = statusConfig.icon;

  return (
    <AnimatePresence>
      {open && (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="max-w-7xl w-[95vw] max-h-[92vh] overflow-hidden p-0 gap-0 bg-background">
            {/* Hidden Title and Description for accessibility */}
            <DialogTitle className="sr-only">{project.name}</DialogTitle>
            <DialogDescription className="sr-only">
              View and manage project details including overview, documents, analytics, and settings.
            </DialogDescription>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="flex flex-col h-full max-h-[92vh]"
            >
              {/* Enhanced Header with Gradient */}
              <div className="relative border-b bg-gradient-to-br from-background via-background to-muted/20">
                <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                <div className="relative px-6 py-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0 space-y-3">
                      <div className="flex items-center gap-3">
                        <Building2 className="h-6 w-6 text-primary flex-shrink-0" />
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight truncate">
                          {project.name}
                        </h2>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-4 w-4" />
                          <span>{project.location ?? "Unknown location"}</span>
                        </div>
                        <Separator orientation="vertical" className="h-4" />
                        <div className="flex items-center gap-1.5">
                          <Thermometer className="h-4 w-4" />
                          <span>Zone {project.climateZone ?? "—"}</span>
                        </div>
                        <Separator orientation="vertical" className="h-4" />
                        <div className="flex items-center gap-1.5">
                          <StatusIcon className={`h-4 w-4 ${statusConfig.color}`} />
                          <Badge variant={statusConfig.variant} className="font-medium">
                            {project.status ?? "Unknown"}
                          </Badge>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              {/* Tabs Navigation */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
                <div className="border-b bg-muted/30">
                  <TabsList className="w-full justify-start rounded-none h-12 bg-transparent p-0 px-6">
                    <TabsTrigger value="overview" className="gap-2 data-[state=active]:bg-background">
                      <FileText className="h-4 w-4" />
                      Overview
                    </TabsTrigger>
                    <TabsTrigger value="documents" className="gap-2 data-[state=active]:bg-background">
                      <Upload className="h-4 w-4" />
                      Documents
                    </TabsTrigger>
                    <TabsTrigger value="analytics" className="gap-2 data-[state=active]:bg-background">
                      <TrendingUp className="h-4 w-4" />
                      Analytics
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="gap-2 data-[state=active]:bg-background">
                      <Edit className="h-4 w-4" />
                      Settings
                    </TabsTrigger>
                  </TabsList>
                </div>

                <ScrollArea className="flex-1">
                  <div className="p-6">
                    {/* Overview Tab */}
                    <TabsContent value="overview" className="mt-0 space-y-6">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        {/* Key Metrics Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="relative overflow-hidden rounded-lg border bg-card p-5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <p className="text-xs font-medium text-muted-foreground">Total Cost</p>
                                <p className="text-2xl font-bold">${(project.estimatedCost ?? 0).toLocaleString()}</p>
                              </div>
                              <DollarSign className="h-8 w-8 text-green-500 opacity-80" />
                            </div>
                            <div className="mt-3">
                              <Progress value={75} className="h-1.5" />
                            </div>
                          </div>

                          <div className="relative overflow-hidden rounded-lg border bg-card p-5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <p className="text-xs font-medium text-muted-foreground">Components</p>
                                <p className="text-2xl font-bold">{project.components ?? 0}</p>
                              </div>
                              <Wind className="h-8 w-8 text-blue-500 opacity-80" />
                            </div>
                            <p className="text-xs text-muted-foreground mt-3">HVAC units detected</p>
                          </div>

                          <div className="relative overflow-hidden rounded-lg border bg-card p-5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <p className="text-xs font-medium text-muted-foreground">Created</p>
                                <p className="text-sm font-semibold">{friendlyDate(project.date)}</p>
                              </div>
                              <Calendar className="h-8 w-8 text-purple-500 opacity-80" />
                            </div>
                            <p className="text-xs text-muted-foreground mt-3">Project start date</p>
                          </div>

                          <div className="relative overflow-hidden rounded-lg border bg-card p-5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <p className="text-xs font-medium text-muted-foreground">Climate Zone</p>
                                <p className="text-2xl font-bold">{project.climateZone ?? "—"}</p>
                              </div>
                              <Thermometer className="h-8 w-8 text-orange-500 opacity-80" />
                            </div>
                            <p className="text-xs text-muted-foreground mt-3">Regional classification</p>
                          </div>
                        </div>

                        {/* Description Section */}
                        <div className="rounded-lg border bg-card p-6 shadow-sm">
                          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <FileText className="h-5 w-5 text-primary" />
                            Project Description
                          </h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {project.description ?? "No description provided for this project. Add a description to help team members understand the project scope and objectives."}
                          </p>
                        </div>

                        {/* Recent Activity Timeline */}
                        <div className="rounded-lg border bg-card p-6 shadow-sm">
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Clock className="h-5 w-5 text-primary" />
                            Recent Activity
                          </h3>
                          <div className="space-y-4">
                            <div className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0">
                              <div className="rounded-full bg-primary/10 p-2">
                                <Upload className="h-4 w-4 text-primary" />
                              </div>
                              <div className="flex-1 space-y-1">
                                <p className="text-sm font-medium">Blueprint Uploaded</p>
                                <p className="text-xs text-muted-foreground">{friendlyDate(project.uploadedAt)}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0">
                              <div className="rounded-full bg-blue-500/10 p-2">
                                <TrendingUp className="h-4 w-4 text-blue-500" />
                              </div>
                              <div className="flex-1 space-y-1">
                                <p className="text-sm font-medium">Analysis Completed</p>
                                <p className="text-xs text-muted-foreground">{friendlyDate(project.analysisDate)}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0">
                              <div className="rounded-full bg-green-500/10 p-2">
                                <DollarSign className="h-4 w-4 text-green-500" />
                              </div>
                              <div className="flex-1 space-y-1">
                                <p className="text-sm font-medium">Estimate Updated</p>
                                <p className="text-xs text-muted-foreground">{friendlyDate(project.estimateUpdated)}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </TabsContent>

                    {/* Documents Tab */}
                    <TabsContent value="documents" className="mt-0 space-y-6">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-6"
                      >
                        {/* Upload Zone */}
                        <div className="rounded-lg border bg-card p-6 shadow-sm">
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Upload className="h-5 w-5 text-primary" />
                            Upload Documents
                          </h3>
                          <DocumentUploadZone
                            projectId={project.id}
                            onUploadSuccess={handleUploadSuccess}
                            onUploadError={(error) => toast.error(error)}
                            compact
                          />
                        </div>

                        {/* Documents List */}
                        <div className="rounded-lg border bg-card p-6 shadow-sm">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                              <FileText className="h-5 w-5 text-primary" />
                              Project Documents
                            </h3>
                            <Badge variant="secondary">
                              {documents.length} {documents.length === 1 ? 'document' : 'documents'}
                            </Badge>
                          </div>

                          {isLoadingDocuments ? (
                            <div className="flex items-center justify-center py-8">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                          ) : documents.length > 0 ? (
                            <div className="space-y-3">
                              {documents.map((doc) => (
                                <motion.div
                                  key={doc.id}
                                  initial={{ opacity: 0, y: 5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="rounded-lg border bg-background hover:bg-muted/50 transition-colors"
                                >
                                  <div className="flex items-center justify-between p-4">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                      <div className="rounded-lg bg-primary/10 p-3 flex-shrink-0">
                                        <FileText className="h-5 w-5 text-primary" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{doc.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                          {(doc.size / (1024 * 1024)).toFixed(2)} MB • Uploaded {friendlyDate(doc.uploadedAt)}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDownload(doc.id, doc.name, doc.url)}
                                        title="Download document"
                                      >
                                        <Download className="h-4 w-4" />
                                      </Button>
                                      <Link href={`/workspace/${project.id}?documentId=${doc.id}`}>
                                        <Button variant="ghost" size="sm" title="View in workspace">
                                          <ExternalLink className="h-4 w-4" />
                                        </Button>
                                      </Link>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDeleteDocument(doc.id)}
                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                        title="Delete document"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          ) : (
                            <div className="rounded-lg border border-dashed bg-muted/20 p-8 text-center">
                              <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-3 opacity-50" />
                              <p className="text-sm text-muted-foreground mb-3">
                                No documents uploaded yet. Upload blueprints, specifications, or other project files above.
                              </p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </TabsContent>

                    {/* Analytics Tab */}
                    <TabsContent value="analytics" className="mt-0 space-y-6">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <div className="rounded-lg border bg-card p-6 shadow-sm">
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <DollarSign className="h-5 w-5 text-primary" />
                            Cost Breakdown
                          </h3>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Equipment</span>
                                <span className="font-medium">${((project.estimatedCost ?? 0) * 0.6).toLocaleString()}</span>
                              </div>
                              <Progress value={60} className="h-2" />
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Labor</span>
                                <span className="font-medium">${((project.estimatedCost ?? 0) * 0.25).toLocaleString()}</span>
                              </div>
                              <Progress value={25} className="h-2" />
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Materials</span>
                                <span className="font-medium">${((project.estimatedCost ?? 0) * 0.15).toLocaleString()}</span>
                              </div>
                              <Progress value={15} className="h-2" />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between pt-2">
                              <span className="font-semibold">Total Estimate</span>
                              <span className="text-xl font-bold text-primary">${(project.estimatedCost ?? 0).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-lg border bg-card p-6 shadow-sm">
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-primary" />
                            Project Insights
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <p className="text-sm text-muted-foreground">Completion Progress</p>
                              <div className="flex items-center gap-2">
                                <Progress value={project.status === "Completed" ? 100 : project.status === "In Progress" ? 45 : 0} className="h-2 flex-1" />
                                <span className="text-sm font-medium">{project.status === "Completed" ? "100%" : project.status === "In Progress" ? "45%" : "0%"}</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <p className="text-sm text-muted-foreground">Analysis Confidence</p>
                              <div className="flex items-center gap-2">
                                <Progress value={92} className="h-2 flex-1" />
                                <span className="text-sm font-medium">92%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </TabsContent>

                    {/* Settings Tab */}
                    <TabsContent value="settings" className="mt-0 space-y-6">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <div className="rounded-lg border bg-card p-6 shadow-sm">
                          <h3 className="text-lg font-semibold mb-4">Project Information</h3>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Project ID</label>
                              <div className="mt-1.5 flex items-center gap-2">
                                <code className="flex-1 text-xs font-mono bg-muted px-3 py-2 rounded border select-all">
                                  {project.id}
                                </code>
                                <Button variant="outline" size="sm" onClick={handleCopyId}>
                                  Copy
                                </Button>
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Created Date</label>
                              <p className="mt-1.5 text-sm">{friendlyDate(project.date)}</p>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-lg border bg-card p-6 shadow-sm">
                          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                          <div className="space-y-2">
                            <Button variant="outline" className="w-full justify-start gap-2" onClick={handleShare}>
                              <Share2 className="h-4 w-4" />
                              Share Project
                            </Button>
                            <Button variant="outline" className="w-full justify-start gap-2" onClick={handleExport}>
                              <Download className="h-4 w-4" />
                              Export Data
                            </Button>
                            <Link href={`/workspace/${project.id}`} className="block">
                              <Button variant="outline" className="w-full justify-start gap-2">
                                <ExternalLink className="h-4 w-4" />
                                Open in Workspace
                              </Button>
                            </Link>
                          </div>
                        </div>

                        <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-6 shadow-sm">
                          <h3 className="text-lg font-semibold mb-2 text-destructive">Danger Zone</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Once you delete this project, there is no going back. Please be certain.
                          </p>
                          <Button
                            variant="destructive"
                            className="gap-2"
                            onClick={handleDelete}
                            disabled={isDeleting}
                          >
                            <Trash2 className="h-4 w-4" />
                            {isDeleting ? "Deleting..." : "Delete Project"}
                          </Button>
                        </div>
                      </motion.div>
                    </TabsContent>
                  </div>
                </ScrollArea>
              </Tabs>
            </motion.div>
          </DialogContent>

          {/* Confirmation dialog: Delete Document */}
          <Dialog open={!!confirmDeleteDocId} onOpenChange={(open) => { if (!open) setConfirmDeleteDocId(null); }}>
            <DialogContent>
              <DialogTitle>Delete document</DialogTitle>
              <DialogDescription>
                {docToDelete ? (
                  <span>Are you sure you want to delete "{docToDelete.name}"? This action cannot be undone.</span>
                ) : (
                  <span>Are you sure you want to delete this document? This action cannot be undone.</span>
                )}
              </DialogDescription>
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setConfirmDeleteDocId(null)}>Cancel</Button>
                <Button variant="destructive" onClick={() => confirmDeleteDocId && performDeleteDocument(confirmDeleteDocId)}>Delete</Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Confirmation dialog: Delete Project */}
          <Dialog open={confirmDeleteProject} onOpenChange={(open) => { if (!open) setConfirmDeleteProject(false); }}>
            <DialogContent>
              <DialogTitle>Delete project</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{project.name}"? This action cannot be undone and will remove all associated documents.
              </DialogDescription>
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setConfirmDeleteProject(false)}>Cancel</Button>
                <Button variant="destructive" onClick={performDeleteProject} disabled={isDeleting}>{isDeleting ? 'Deleting...' : 'Delete Project'}</Button>
              </div>
            </DialogContent>
          </Dialog>

        </Dialog>
      )}
    </AnimatePresence>
  );
}
