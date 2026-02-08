const BillingIssue = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-8 text-center shadow-xl">
        
        {/* Image */}
        <img
          src="https://www.logicmonitor.com/wp-content/uploads/2015/09/aws_billing.png"
          alt="AWS Billing Issue"
          className="mx-auto mb-6 w-48"
        />

        {/* Title */}
        <h1 className="text-xl font-semibold text-white mb-2">
          ⚠️ Service Temporarily Unavailable
        </h1>

        {/* Description */}
        <p className="text-sm text-slate-400 leading-relaxed">
          We are currently experiencing an <span className="text-slate-200 font-medium">
          AWS billing issue</span>.  
          Some features like chat, calls, and posts may not work at the moment. 
          I use for project not a production app
        </p>

        {/* Info Box */}
        <div className="mt-6 rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-slate-300">
          🔧 Our team is actively working to resolve this issue.  
          Please check back shortly.
        </div>

        {/* Footer */}
        <p className="mt-4 text-xs text-slate-500">
          Thank you for your patience 💙
        </p>
      </div>
    </div>
  );
};

export default BillingIssue;
