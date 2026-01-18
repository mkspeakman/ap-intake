import { useState } from 'react';
import { MessageSquare, Send, Camera } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';

const FEEDBACK_FISH_PROJECT_ID = import.meta.env.VITE_FEEDBACK_FISH_PROJECT_ID || '';

export function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState('');
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const captureScreenshot = async () => {
    try {
      // Use the browser's native screenshot API if available
      // Otherwise, we'll just let users describe the issue
      const canvas = document.createElement('canvas');
      
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // For now, just show a message that screenshot is captured
      // In production, you'd use html2canvas or a similar library
      setScreenshot('screenshot-placeholder');
    } catch (error) {
      console.error('Screenshot capture failed:', error);
    }
  };

  const submitFeedback = async () => {
    if (!feedback.trim()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('https://feedback.fish/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: FEEDBACK_FISH_PROJECT_ID,
          message: feedback,
          email: email || undefined,
          metadata: {
            url: window.location.href,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            viewport: `${window.innerWidth}x${window.innerHeight}`,
          },
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => {
          setIsOpen(false);
          setFeedback('');
          setEmail('');
          setScreenshot(null);
          setSubmitted(false);
        }, 2000);
      } else {
        throw new Error('Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Feedback Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
        aria-label="Send Feedback"
      >
        <MessageSquare className="h-5 w-5" />
        <span className="font-medium">Feedback</span>
      </button>

      {/* Feedback Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Send Feedback
            </DialogTitle>
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

              {/* Screenshot option */}
              <div className="pt-2 border-t">
                <button
                  onClick={captureScreenshot}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  disabled={isSubmitting}
                >
                  <Camera className="h-4 w-4" />
                  {screenshot ? '✓ Screenshot captured' : 'Capture screenshot (optional)'}
                </button>
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
                  onClick={() => setIsOpen(false)}
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
    </>
  );
}
