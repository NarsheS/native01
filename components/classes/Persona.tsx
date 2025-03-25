export default class Persona {
  id: string;
  name: string;
  address: string;
  contact: string;
  category: { id: number; name: string }[];
  imageURI: string | null;

  constructor(id: string,
    name: string,
    address: string,
    contact: string,
    category: { id: number; name: string }[],
    imageURI: string | null
  ) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.contact = contact;
    this.category = category;
    this.imageURI = imageURI;
  }
}