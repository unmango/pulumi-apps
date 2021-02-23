interface A { type: 'b' | 'c'; }
interface B extends A { type: 'b'; }
interface C extends A { type: 'c'; }
type D = B | C;

class Foo { }
class Bar { }

type GetFooBar<T extends D> =
  T extends B ? Foo :
  T extends C ? Bar :
  never;

function getFooBar(test: B): Foo;
function getFooBar(test: C): Bar;
function getFooBar(test: D): Foo | Bar {
  switch(test.type) {
  case 'b':
    return new Foo();
  case 'c':
    return new Bar();
  }
}

const shouldBeFoo = getFooBar({ type: 'b' });
const shouldBeBar = getFooBar({ type: 'c' });

// class Test<T extends D> {
//   public fooBar: GetFooBar<T>;

//   constructor(arg: T) {
//     switch(arg.type) {
//     case 'b':
//       this.fooBar = getFooBar(arg);
//       break;
//     case 'c':
//       this.fooBar = getFooBar(arg);
//       break;
//     }
//   }
// }
