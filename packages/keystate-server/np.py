from sys import argv
from os.path import join
from numpy.random import randint

def main():
  if len(argv) != 2:
    print("Usage: np.py <file>")
    exit(1)
  file = join(argv[1], 'np.txt')
  with open(file, 'w') as f:
    f.write(str(randint(1, 100, (10, 10))))

if __name__ == '__main__':
  main()