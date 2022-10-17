export class RandomError {
   static throw(): void {
      const random =  Math.floor( Math.random() * (3000 - 10) + 10)
      if(random % 2){
        throw new Error("Error calling db")
      }
    }
}