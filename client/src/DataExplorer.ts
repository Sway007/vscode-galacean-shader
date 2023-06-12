import { TreeDataProvider, TreeItem } from 'vscode';

export class GProject extends TreeItem {}

export class ProjectDataProvider implements TreeDataProvider<GProject> {
  getChildren() {
    return [];
  }

  getTreeItem(element) {
    return element;
  }
}
