import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FingerprintRule, Editable, RuleEditModal } from '../rule-edit-modal/rule-edit-modal';
import { environment } from '../../../../environments/environment';

//interface FingerprintRule { id: number; name: string; score: number; status: 'Ativo'|'Inativo'; }

@Component({
  selector: 'app-fingerprint-score-config',
  standalone: true,
  imports: [CommonModule, FormsModule, RuleEditModal],
  templateUrl: './fingerprint-score-config.html',
  styleUrls: ['../dashboard/dashboard.scss', './fingerprint-score-config.scss']
})
export class FingerprintScoreConfig {
  private token = environment.token;

  readonly q = signal('');

  readonly editing = signal<FingerprintRule | null>(null);

  private readonly data = signal<FingerprintRule[]>([]);

  readonly rows = computed(() => {
    const t = this.q().trim().toLowerCase();
    if (!t) return this.data();
    return this.data().filter(r =>
      String(r.id).includes(t) ||
      r.name.toLowerCase().includes(t) ||
      String(r.score).includes(t) ||
      r.status.toLowerCase().includes(t)
    );
  });


  constructor() {
    setTimeout(() => {this.fillData();}, 500);
  }

  trackBy = (_: number, r: FingerprintRule) => r.id;
  edit(r: FingerprintRule) { this.editing.set(r); }


  onSave(updated: Editable) {
    
    if (!isFingerprint(updated)) {
      console.warn('Tipo inesperado no save do Fingerprint:', updated);
      return;
    }

    let request = {
      id: updated.id,
      score: updated.score,
      status: "Ativo" == updated.status ? 1 : 0
    }
    this.updatedFingerprintScoreData(request)
        .then(() => {
          this.data.update(all => all.map(x => x.id === updated.id ? updated : x));
          this.editing.set(null);      
        })
        .catch((err) => console.error(err))
  }
  
  
  
    fillData() {
  
      this.getFingeprintcoreData()
          .then((resp) => {
              let transformedData = this.transformData(resp);
              this.data.update(value => transformedData);
          })
          .catch((err) => console.error(err));
  
    }
    
    transformData(resp: any[]): FingerprintRule[] {
      let data: FingerprintRule[] = [];
  
      for(let item of resp) {
        data.push({
          kind: 'fingerprint',
          id: item.id,
          name: item.name,
          score: item.score,
          status: item.status == 1 ? "Ativo": "Inativo"
        })
      }
  
      return data;
    }
  
    async getFingeprintcoreData(): Promise<any> {
  
      return await new Promise<void>((resolve, reject) => {

        fetch("http://localhost:8080/api/v1/fingerprint-scores", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.token
            }
        })
        .then((resp) => {
  
          resp.json()
              .then((json) => {
  
                resolve(json)
  
              })
              .catch((err) => reject(err))
  
        })
        .catch((err) => reject(err));

      });
    } 

    async updatedFingerprintScoreData(data: any): Promise<any> {
  
      return await new Promise<void>((resolve, reject) => {
  
        fetch("http://localhost:8080/api/v1/fingerprint-scores", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.token
            },
            body: JSON.stringify(data)
        })
        .then((resp) => {
  
          resp.json()
              .then((json) => {
                resolve(json)
              })
              .catch((err) => reject(err))
  
        })
        .catch((err) => reject(err));
  
      });
    }
}

function isFingerprint(x: Editable | null): x is FingerprintRule {
  return !!x && x.kind === 'fingerprint';
}