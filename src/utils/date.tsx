// src/utils/dateConverter.ts
export const formatDate = (dateStr: string): string => {
    if(dateStr){
        const date = new Date(dateStr);
        const options: Intl.DateTimeFormatOptions = {
          // year: 'numeric',
          // month: 'long',
          // day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          hour12: true 
        };
        return date.toLocaleString('en-US', options);
    }else{
        return ''
    }
   
  };

  export const convertSeconds = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
  
    let result = '';
  
    if (hours > 0) {
      result += `${hours}hr `;
    }
    if (minutes > 0) {
      result += `${minutes}mins `;
    }
    if (remainingSeconds > 0 || (hours === 0 && minutes === 0)) {
      result += `${remainingSeconds}secs`;
    }
    return result.trim();
  };
  