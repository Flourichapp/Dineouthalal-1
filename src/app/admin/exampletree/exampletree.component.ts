import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { SelectionModel } from '@angular/cdk/collections';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Component, OnInit, Output,EventEmitter ,ChangeDetectorRef} from '@angular/core';

interface TreeNode {
  id: number;
  screen_name: string;
  subscreen: boolean;
  parent_screen: number; // Store the ID of the parent screen
  isSelected?: boolean;
  children?: TreeNode[];
}

interface FlatNode {
  id: number;
  expandable: boolean;
  screen_name: string;
  level: number;
  isSelected: boolean; // Non-optional
}

@Component({
  selector: 'app-exampletree',
  templateUrl: './exampletree.component.html',
  styleUrls: ['./exampletree.component.scss']
})
export class ExampletreeComponent implements OnInit {
  constructor(private http: HttpClient,
        private cdRef: ChangeDetectorRef

    ) {}
  AccessListData: TreeNode[] = [];

  selectedNodeIds: number[] = [];

  flatTreeControl = new FlatTreeControl<FlatNode>(
    node => node.level,
    node => node.expandable,
    
  );

  treeFlattener = new MatTreeFlattener<TreeNode, FlatNode>(
    (node, level) => {
      return {
        id: node.id,
        expandable: !!node.children && node.children.length > 0,
        screen_name: node.screen_name,
        level: level,
        parent_screen : node.parent_screen,
        subscreen : node.subscreen,
        isSelected : node.isSelected
      };
    },
    node => node.level,
    node => node.expandable,
    node => node.children,

  );

  dataSource = new MatTreeFlatDataSource(
    this.flatTreeControl,
    this.treeFlattener
  );

  ngOnInit(): void {
    this.getAllAccessList()
    // this.generateTree();
  }
  getAllAccessList() {
    // Clear the existing data
    this.AccessListData = [];
  
    this.http.get<any>(`${environment.apiUrl}/admin/v0/accessLists`)
      .subscribe(
        (res) => {
          const mappedData = res.data.map(item => {
            const parent_screen = item.parent_screen.trim(); // Trim any extra spaces
            return {
              id: item.id,
              screen_name: item.screen_name,
              subscreen: item.subscreen === 'true',
              parent_screen: parent_screen === '' ? 0 : parseInt(parent_screen, 10),
            };
          });
  
          this.AccessListData = mappedData;
          this.generateTree();
        },
      );
  }
  

 
  toggleNodeSelection(node: TreeNode): void {
    const index = this.selectedNodeIds.indexOf(node.id);
  
    if (index !== -1) {
      this.selectedNodeIds.splice(index, 1);
    } else {
      this.selectedNodeIds.push(node.id);
    }
  
    // if (node.parent_screen !== 0) { 
    //   const parentName = this.getParentNameById(node.parent_screen);
    //   const parentNode = this.AccessListData.find(parent => parent.screen_name === parentName);
    
    //   if (parentNode) {
    //     this.toggleNodeSelection(parentNode);
    //   }
    // }
  
  
    
  }
  
  selectNodesBasedOnIds(nodes: TreeNode[]) {
    nodes.forEach(node => {

      if (this.selectedNodeIds.includes(node.id)) {
        node.isSelected = true;
      } else {
        node.isSelected = false;
      }
  
      if (node.children) {
        this.selectNodesBasedOnIds(node.children);
      }
    });
  }
  convertFlatNodesToTreeNodes(flatNodes: FlatNode[], selectedNodeIds: number[]): TreeNode[] {
    const treeNodes: TreeNode[] = [];
    let currentParent: TreeNode | null = null;
  
    for (const node of flatNodes) {
      const isSelected = selectedNodeIds.includes(node.id);
  
      if (node.level === 0) {
        currentParent = {
          id: node.id,
          screen_name: node.screen_name,
          subscreen: false,
          parent_screen: 0,
          isSelected: isSelected,
          children: [],
        };
        treeNodes.push(currentParent);
      } else if (currentParent) {
        currentParent.children.push({
          id: node.id,
          screen_name: node.screen_name,
          subscreen: false,
          parent_screen: currentParent.id, // Use the ID of the parent node
          isSelected: isSelected,
          children: [],
        });
      }
    }
  
    return treeNodes;
  }
  generateTree() {
    const treeData = this.buildTree(this.AccessListData, 0); 
    const flatTreeData = this.flattenTreeData(treeData);
  
    const treeNodes = this.convertFlatNodesToTreeNodes(flatTreeData, this.selectedNodeIds);
    this.dataSource.data = treeNodes;
  
    this.selectNodesBasedOnIds(this.dataSource.data);
  
  }
  
  

  buildTree(data: TreeNode[], parentScreen: number): TreeNode[] {
    const treeNodes: TreeNode[] = [];

    data.forEach(node => {
      if (node.parent_screen === parentScreen) {
        const children = this.buildTree(data, node.id);
        if (children.length > 0) {
          node.children = children;
        }
        treeNodes.push(node);
      }
    });

    return treeNodes;
  }

  flattenTreeData(nodes: TreeNode[], level: number = 0): FlatNode[] {
    const flatNodes: FlatNode[] = [];
    for (const node of nodes) {
      const flatNode: FlatNode = {
        id: node.id,
        expandable: node.children && node.children.length > 0,
        screen_name: node.screen_name,
        level: level,
        isSelected : node.isSelected,
      };
      flatNodes.push(flatNode);

      if (node.children) {
        flatNodes.push(...this.flattenTreeData(node.children, level + 1));
      }
    }
    return flatNodes;
  }

  selectNode(node: TreeNode): void {
    node.isSelected = !node.isSelected;
  }

  hasChild = (_: number, node: FlatNode) => {
    return node.expandable;
  };

  getParentNameById(id: number): string {
    const parent = this.AccessListData.find(node => node.id === id);
    return parent ? parent.screen_name : "";
  }
}
