import React from 'react';
class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }
  
    static getDerivedStateFromError(error) {  
        console.error(error)  
        // Update state so the next render will show the fallback UI.   
        return { hasError: true };  
    }
    componentDidCatch(error, errorInfo) {  
        console.error(error, errorInfo)
    }
    render() {
      if (this.state.hasError) {      
          // You can render any custom fallback UI      
          return <h1 className="w-full text-center text-gray-700 font-semibold text-lg">An error occured, the block will try resume shortly, if not contact the developer</h1>;   
         }
      return this.props.children; 
    }
  }

  export default ErrorBoundary;