const useLogData = (data: any, title: string = '') => {
  if (__DEV__) console.log(title, JSON.stringify(data, null, 2));
};

export default useLogData;
