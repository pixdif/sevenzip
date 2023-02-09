# Node.js Library for 7-Zip ![Node.js CI](https://github.com/pixdif/sevenzip/workflows/Node.js%20CI/badge.svg)

This is a Node.js Library to find and run 7-Zip.

## License
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <http://www.gnu.org/licenses/>.

## Environment
* Node v18.x or later versions

## Get Started

### Find installed 7-Zip
```TypeScript
import { SevenZip } from '@pixdif/sevenzip';

const zip = new SevenZip();
await zip.findInstalled();
```

### Compress and extract files
```TypeScript
import { SevenZip, Archive } from '@pixdif/sevenzip';

const zip = new SevenZip({ executable: '7z' });
const example = new Archive(zip, 'my-archive.7z');
await example.add('file1.txt', 'file2.txt');

await example.extract({
	outputDir: 'my-archive',
	ignoreDirs: true,
});
```
