const expressableTimeConverter = (time: number): string => {
  const numerucalSeconds = Math.floor(time % 60);
  const numerucalMins = Math.floor(time / 60);

  let alphabeticalSeconds: string;
  let alphabeticalMins: string;

  if(numerucalSeconds - 10 < 0){
    alphabeticalSeconds = "0" + String(numerucalSeconds);
  }else{
    alphabeticalSeconds = String(numerucalSeconds)
  }

  if(numerucalMins - 10 < 0){
    alphabeticalMins = "0" + String(numerucalMins);
  }else{
    alphabeticalMins = String(numerucalMins)
  }

  return `${alphabeticalMins}:${alphabeticalSeconds}`;
};

export default expressableTimeConverter;