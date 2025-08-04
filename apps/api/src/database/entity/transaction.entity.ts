import { Entity, PrimaryGeneratedColumn, Column, Index, BaseEntity, UpdateDateColumn, CreateDateColumn, DeleteDateColumn, BeforeInsert, ManyToOne, JoinColumn, Relation } from "typeorm";
import { Item } from "./item.entity";

@Entity('transactions')
export class Transaction extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({name: 'item_id'})
    itemId!: string;

    @ManyToOne('Item','transactions')
    @JoinColumn({
        name:'item_id',
        referencedColumnName: 'id',
        foreignKeyConstraintName: 'FK_items_items'
    })
    item?: Relation<Item>;
    
    @Column({type: 'text'})
    name!: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
    updatedAt!: Date;

    @DeleteDateColumn({
        nullable: true,
        name: 'deleted_at',
        type: 'timestamp with time zone',
        default: null,
    })
    deletedAt!: Date | null;
}