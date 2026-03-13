export default function (senha: string = ''): boolean{
  const regex = /^.*(?=.{6,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$%&@? "]).*$/
  return regex.test(senha)
}
