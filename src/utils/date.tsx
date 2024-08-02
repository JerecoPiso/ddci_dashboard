// src/utils/dateConverter.ts
export const formatDate = (dateStr: string): string => {
    if(dateStr){
        const date = new Date(dateStr);
        const options: Intl.DateTimeFormatOptions = {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          hour12: true // true for 12-hour format
        };
        
        return date.toLocaleString('en-US', options);
    }else{
        return ''
    }
   
  };