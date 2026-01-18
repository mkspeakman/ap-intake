import { useState } from 'react';
import { MessageSquare, Send, Camera, X } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import html2canvas from 'html2canvas';

interface FeedbackWidgetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FeedbackWidget({ open, onOpenChange }: FeedbackWidgetProps) {
  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState('');
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const captureScreenshot = async () => {
    setIsCapturing(true);
    try {
      // Temporarily hide the dialog to capture the page behind it
      onOpenChange(false);
      
      // Wait a bit for the dialog to close
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Capture the screenshot
      const canvas = await html2canvas(document.body, {
        useCORS: true,
        allowTaint: true,
        scrollY: -window.scrollY,
        scrollX: -window.scrollX,
      });
      
      // Convert to base64
      const screenshotData = canvas.toDataURL('image/png');
      setScreenshot(screenshotData);
      
      // Reopen the dialog
      onOpenChange(true);
    } catch (error) {
      console.error('Screenshot capture failed:', error);
      alert('Failed to capture screenshot');
      onOpenChange(true);
    } finally {
      setIsCapturing(false);
    }
  };

  const submitFeedback = async () => {
    console.log('submitFeedback called, feedback:', feedback);
    
    if (!feedback.trim()) {
      console.log('Feedback is empty, returning');
      return;
    }

    setIsSubmitting(true);
    console.log('Starting feedback submission...');

    try {
      const payload = {
        message: feedback,
        email: email || undefined,
        metadata: {
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
          viewport: `${window.innerWidth}x${window.innerHeight}`,
          screenshot: screenshot || undefined,
        },
      };
      
      console.log('Sending payload:', payload);
      
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('Response status:', response.status);
      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (response.ok) {
        console.log('Feedback submitted successfully!');
        setSubmitted(true);
        setTimeout(() => {
          onOpenChange(false);
          setFeedback('');
          setEmail('');
          setScreenshot(null);
          setSubmitted(false);
        }, 2000);
      } else {
        console.error('Response not OK:', responseData);
        throw new Error('Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      console.log('Setting isSubmitting to false');
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Send Feedback
            </DialogTitle>
            <DialogDescription>
              Share your thoughts, report bugs, or suggest improvements to help us make this app better.
            </DialogDescription>
          </DialogHeader>

          {submitted ? (
            <div className="py-8 text-center">
              <div className="text-4xl mb-3">✅</div>
              <h3 className="text-lg font-semibold mb-2">Thank you!</h3>
              <p className="text-sm text-muted-foreground">
                Your feedback has been received and will help improve the app.
              </p>
            </div>
          ) : (
            <div className="space-y-4 pt-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  What's on your mind?
                </label>
                <Textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Share your thoughts, report a bug, or suggest a feature..."
                  className="min-h-[120px] resize-none"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Email (optional)
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  disabled={isSubmitting}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  We'll only use this to follow up on your feedback
                </p>
              </div>

              {/* Screenshot Section */}
              <div className="pt-2 border-t">
                {screenshot ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Screenshot attached</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setScreenshot(null)}
                        disabled={isSubmitting}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <img 
                      src={screenshot} 
                      alt="Screenshot preview" 
                      className="w-full rounded border"
                    />
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={captureScreenshot}
                    disabled={isSubmitting || isCapturing}
                    className="w-full"
                  >
                    {isCapturing ? (
                      <>
                        <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                        Capturing...
                      </>
                    ) : (
                      <>
                        <Camera className="h-4 w-4 mr-2" />
                        Attach Screenshot
                      </>
                    )}
                  </Button>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={submitFeedback}
                  disabled={!feedback.trim() || isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Feedback
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>

              <p className="text-xs text-center text-muted-foreground pt-2">
                Your feedback helps us improve. Thank you! 🙏
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
  );
}
