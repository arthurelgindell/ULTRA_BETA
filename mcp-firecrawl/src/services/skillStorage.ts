import * as fs from 'fs/promises';
import * as path from 'path';

export class SkillStorage {
  constructor(private basePath: string) {}

  async saveSkill(name: string, data: any, type: string): Promise<void> {
    const skillPath = path.join(this.basePath, type);
    await fs.mkdir(skillPath, { recursive: true });
    await fs.writeFile(path.join(skillPath, `${name}.json`), JSON.stringify(data, null, 2));
    await fs.writeFile(path.join(skillPath, `${name}.md`), this.convertToMarkdown(data));
  }

  async searchSkills(query: string, type?: string, format: 'json' | 'markdown' | 'both' = 'both'): Promise<any[]> {
    const skills = await this.listSkills(type, format);
    return skills.filter(skill => JSON.stringify(skill).includes(query));
  }

  async listSkills(type?: string, format: 'json' | 'markdown' | 'both' = 'both'): Promise<any[]> {
    const skillTypes = type ? [type] : await this.getSkillTypes();
    const skills: any[] = [];

    for (const skillType of skillTypes) {
      const skillPath = path.join(this.basePath, skillType);
      const files = await fs.readdir(skillPath);

      for (const file of files) {
        if (format === 'json' && file.endsWith('.json')) {
          const content = await fs.readFile(path.join(skillPath, file), 'utf-8');
          skills.push(JSON.parse(content));
        } else if (format === 'markdown' && file.endsWith('.md')) {
          const content = await fs.readFile(path.join(skillPath, file), 'utf-8');
          skills.push(content);
        } else if (format === 'both') {
            if (file.endsWith('.json')) {
                const content = await fs.readFile(path.join(skillPath, file), 'utf-8');
                skills.push(JSON.parse(content));
            }
        }
      }
    }

    return skills;
  }

  private async getSkillTypes(): Promise<string[]> {
    const entries = await fs.readdir(this.basePath, { withFileTypes: true });
    return entries.filter(entry => entry.isDirectory()).map(entry => entry.name);
  }

  private convertToMarkdown(data: any): string {
    let markdown = '';
    for (const key in data) {
      markdown += `## ${key}\n\n`;
      if (Array.isArray(data[key])) {
        data[key].forEach((item: any) => {
          if (typeof item === 'object') {
            for (const subKey in item) {
              markdown += `**${subKey}**: ${item[subKey]}\n`;
            }
            markdown += '\n';
          } else {
            markdown += `- ${item}\n`;
          }
        });
      } else if (typeof data[key] === 'object') {
        for (const subKey in data[key]) {
          markdown += `**${subKey}**: ${data[key][subKey]}\n`;
        }
        markdown += '\n';
      } else {
        markdown += `${data[key]}\n\n`;
      }
    }
    return markdown;
  }
}
